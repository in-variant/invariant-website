#!/usr/bin/env python3
"""Repeat four primary-source checks for the 432 Park Avenue parcel MCP trial."""

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen

DTM = "https://services6.arcgis.com/yG5s3afENB5iO9fj/ArcGIS/rest/services/DTM_ETL_DAILY_view/FeatureServer"
MAPPLUTO = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/MAPPLUTO/FeatureServer"
UNIT = "1012921303"
BILLING = "1012927502"
BASE = "1012920033"
ARTICLE = "https://invariant-ai.com/blog/gis-mcp-servers-for-site-selection#replay-a-condo-parcel-answer"


def query(server, layer, where, **options):
    url = f"{server}/{layer}/query?" + urlencode({"where": where, "f": "json", **options})
    with urlopen(url, timeout=20) as response:
        raw = response.read()
    payload = json.loads(raw)
    if "error" in payload:
        raise ValueError(f"ArcGIS returned an error for {url}: {payload['error']}")
    receipt = {
        "source_url": url,
        "observed_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "response_sha256": hashlib.sha256(raw).hexdigest(),
    }
    return payload, receipt


def record(server, layer, where, fields):
    payload, receipt = query(server, layer, where, outFields=fields, returnGeometry="false")
    features = payload["features"]
    if len(features) != 1 or payload.get("exceededTransferLimit"):
        raise ValueError(f"Expected one complete record at {receipt['source_url']}; received {len(features)}")
    return {**receipt, "record": features[0]["attributes"]}


def capture():
    unit = record(DTM, 4, f"UNIT_BBL='{UNIT}'", "UNIT_BBL,CONDO_BASE_BBL,CONDO_NUMBER,EFFECTIVE_TAX_YEAR")
    count, geometry = query(DTM, 0, f"BBL='{UNIT}'", returnCountOnly="true")
    polygon_count = count["count"]
    if type(polygon_count) is not int or polygon_count < 0:
        raise ValueError(f"Invalid polygon count from {geometry['source_url']}")
    relationship = record(DTM, 3, f"CONDO_BILLING_BBL='{BILLING}'",
                          "CONDO_BILLING_BBL,CONDO_BASE_BBL,CONDO_NUMBER")
    billing = record(MAPPLUTO, 0, f"BBL={BILLING}", "BBL,Address,CondoNo,Version")
    return {
        "title": "Parcel MCP source replay at 432 Park Avenue",
        "article": ARTICLE,
        "scope": "Four NYC public record queries. No paid provider response or ownership determination.",
        "named_inputs": {"unit_bbl": UNIT, "billing_bbl": BILLING, "mapped_base_bbl": BASE},
        "checks": {
            "condo_unit": unit,
            "unit_polygon": {**geometry, "record": {"bbl": UNIT, "polygon_count": polygon_count}},
            "billing_to_base": relationship,
            "mappluto_billing": billing,
        },
    }


def compare(baseline, current):
    if baseline.get("named_inputs") != current["named_inputs"]:
        raise ValueError("The baseline is for a different set of lot IDs.")
    changes = []
    for name, evidence in current["checks"].items():
        previous = baseline["checks"][name]["record"]
        if previous != evidence["record"]:
            changes.append({"check": name, "baseline": previous, "current": evidence["record"]})
    return changes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--compare", type=Path, metavar="BASELINE_JSON",
                        help="Compare current city records with a saved replay, ignoring retrieval times and hashes.")
    args = parser.parse_args()
    try:
        evidence = capture()
        if args.compare:
            with args.compare.open(encoding="utf-8") as baseline_file:
                evidence["changes_from_baseline"] = compare(json.load(baseline_file), evidence)
        print(json.dumps(evidence, indent=2, ensure_ascii=False))
    except (KeyError, OSError, TypeError, ValueError) as error:
        print(f"Replay could not complete: {error}", file=sys.stderr)
        return 1
    return 2 if evidence.get("changes_from_baseline") else 0


if __name__ == "__main__":
    sys.exit(main())
