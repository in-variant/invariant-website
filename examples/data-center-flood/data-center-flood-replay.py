"""Read or replay two dated FEMA flood map checks against public map services."""

import argparse
import hashlib
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path


REFERENCE = Path(__file__).with_name("data-center-flood-dallas-tampa.json")
REFERENCE_SHA256 = "dbe0403e4c6cfc4c5cdd9ff50045941cf77b7bde9a05352977ec6c367475eb16"
CASES = ("dallas", "tampa")


def digest(body):
    return hashlib.sha256(body).hexdigest()


def fetch_source(item):
    name, source = item
    try:
        result = subprocess.run(
            ["curl", "--disable", "--fail", "--silent", "--show-error", "--proto", "=https",
             "--max-time", "20", source["url"]],
            check=True, capture_output=True,
        )
    except subprocess.CalledProcessError as error:
        raise ValueError(f"{name} request failed (curl exit {error.returncode})") from error
    response = json.loads(result.stdout)
    if not isinstance(response, dict) or "error" in response or response.get("exceededTransferLimit"):
        raise ValueError(f"{name} returned an error or truncated response")
    features = response.get("features")
    if not isinstance(features, list):
        raise ValueError(f"{name} returned no feature collection")
    sha256 = digest(result.stdout)
    return name, (features, {
        "url": source["url"],
        "sha256": sha256,
        "same_response_bytes": sha256 == source["sha256"],
    })


def one(features, label):
    if len(features) != 1:
        raise ValueError(f"Expected one {label} record, received {len(features)}")
    return features[0]


def zone_labels(rows):
    return sorted({f'{row["FLD_ZONE"]} / {row["ZONE_SUBTY"]}' for row in rows})


def panel_label(attributes):
    day = datetime.fromtimestamp(attributes["EFF_DATE"] / 1000, timezone.utc).date().isoformat()
    return {"panel": attributes["FIRM_PAN"], "effective_date": day}


def recorded_claims(case):
    def scope(record):
        return {
            "mapped_fraction": record["mapped_fraction"],
            "sfha_fraction": record["sfha_fraction"],
            "zones": zone_labels(record["zones"]),
        }

    building = case["footprint"]
    recorded = {
        "point_zone": zone_labels([case["point_zone"]]),
        "point_panel": panel_label(one(case["effective_map_panels"], "reference panel")),
        "point_inside_parcel": case["point_inside_parcel"],
        "parcel_panel": panel_label(one(case["effective_map_panels"], "reference panel")),
        "parcel": scope(case["parcel"]),
    }
    if building["resolved"]:
        recorded["building"] = scope(building) | {
            "address_point_distance_m": building["address_point_distance_to_footprint_m"]
        }
        recorded["evacuation"] = {
            "point_zone": case["hurricane_evacuation_map"]["point"]["ZONE"],
            "parcel_fraction": case["hurricane_evacuation_map"]["parcel_fraction"],
        }
    else:
        recorded["building_candidates_at_point_or_address"] = 0
    return recorded


def replay(city, case):
    from pyproj import Transformer
    from shapely import make_valid, transform
    from shapely.geometry import shape
    from shapely.ops import unary_union

    projection = Transformer.from_crs(4326, 5070, always_xy=True)
    with ThreadPoolExecutor(max_workers=4) as pool:
        sources = dict(pool.map(fetch_source, case["sources"].items()))
    features = {name: result[0] for name, result in sources.items()}

    def projected(geometry):
        return transform(make_valid(geometry), projection.transform, interleaved=False)

    def area_hits(geometry, candidates):
        boundary = projected(geometry)
        if boundary.area <= 0:
            raise ValueError("Expected a polygon with positive area")
        hits = []
        for candidate in candidates:
            intersection = boundary.intersection(projected(shape(candidate["geometry"])))
            if intersection.area >= 0.01:
                hits.append((candidate["properties"], intersection))
        return boundary, hits

    def hazard_scope(geometry):
        boundary, hits = area_hits(geometry, features["parcel_and_building_zones"])
        coverage = round(unary_union([g for _, g in hits]).area / boundary.area, 8)
        sfha = unary_union([g for row, g in hits if row["SFHA_TF"] == "T"]).area
        return {
            "mapped_fraction": coverage,
            "sfha_fraction": round(sfha / boundary.area, 8) if coverage == 1.0 else None,
            "zones": zone_labels([row for row, _ in hits]),
        }

    address_features = features["address"]
    if city == "tampa":
        address_features = [row for row in address_features if row["properties"]["STATUS"] == "Current"]
    address = one(address_features, "current address")
    point = shape(address["geometry"])
    if list(point.coords[0]) != case["address_point_epsg4326"]:
        raise ValueError("The address point moved. Update the point and envelope queries before comparing.")
    parcel_feature = one(features["parcel"], "tax parcel")
    parcel = shape(parcel_feature["geometry"])
    address_id, parcel_id = ("ACCOUNTNUMBER", "PARCELID") if city == "dallas" else ("STRAP", "STRAP")
    if address["properties"][address_id] != parcel_feature["properties"][parcel_id]:
        raise ValueError("The address and parcel identifiers no longer match")
    _, panels = area_hits(parcel, features["parcel_panels"])
    observed = {
        "point_zone": zone_labels([one(features["point_zone"], "point flood zone")["attributes"]]),
        "point_panel": panel_label(one(features["point_panel"], "point panel")["attributes"]),
        "point_inside_parcel": parcel.covers(point),
        "parcel_panel": panel_label(one([row for row, _ in panels], "parcel panel")),
        "parcel": hazard_scope(parcel),
    }
    if city == "dallas":
        observed["building_candidates_at_point_or_address"] = sum(
            shape(row["geometry"]).covers(point) or row["properties"]["PROP_ADDR"] == "400 S AKARD ST"
            for row in features["footprint_candidate_query"]
        )
    else:
        footprint = one(features["footprint"], "Tampa footprint")
        if footprint["properties"]["FULLADDRESS"].casefold() != address["properties"]["FULLADDR"].casefold():
            raise ValueError("The Tampa footprint and address text no longer match")
        for field in ("STRAP", "FOLIO"):
            if footprint["properties"][field] != parcel_feature["properties"][field]:
                raise ValueError("The Tampa footprint and parcel identifiers no longer match")
        building = shape(footprint["geometry"])
        observed["building"] = hazard_scope(building) | {
            "address_point_distance_m": round(projected(point).distance(projected(building)), 3)
        }
        boundary, hits = area_hits(parcel, features["evacuation"])
        zone = one(
            [row["properties"]["ZONE"] for row in features["evacuation"] if shape(row["geometry"]).covers(point)],
            "evacuation zone at the point",
        )
        overlap = unary_union([g for row, g in hits if row["ZONE"] == zone]).area
        observed["evacuation"] = {
            "point_zone": zone,
            "parcel_fraction": round(min(1.0, overlap / boundary.area), 8),
        }
    return observed, {name: result[1] for name, result in sources.items()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case", choices=CASES)
    parser.add_argument("--live", action="store_true", help="Recheck the case against agency endpoints")
    args = parser.parse_args()
    try:
        raw = REFERENCE.read_bytes()
        if digest(raw) != REFERENCE_SHA256:
            raise ValueError("The dated reference file failed its SHA-256 check")
        reference = json.loads(raw)
        case = reference["cases"][CASES.index(args.case)]
        expected = recorded_claims(case)
        result = {
            "case": args.case,
            "address": case["address"],
            "reference_date": reference["retrieved_on"],
            "reference_sha256": REFERENCE_SHA256,
            "recorded": expected,
        }
        if args.live:
            observed, sources = replay(args.case, case)
            changed = [name for name, value in expected.items() if observed[name] != value]
            result.update(
                checked_at_utc=datetime.now(timezone.utc).isoformat(timespec="seconds"),
                live=observed, changed=changed, sources=sources,
            )
        print(json.dumps(result, indent=2))
        return 2 if result.get("changed") else 0
    except ImportError:
        parser.exit(1, "Live replay needs pyproj and shapely. See the flood screening guide.\n")
    except (OSError, KeyError, ValueError) as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    raise SystemExit(main())
