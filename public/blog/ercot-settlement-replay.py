"""Replay one ERCOT 15-minute settlement interval from its dated source rows."""

import argparse
import csv
import hashlib
import io
import json
import zipfile
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path


FIXTURE = Path(__file__).with_name("ercot-lmp-settlement-price-replay.json")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def cents(value):
    return str(value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def read_report(directory, archive):
    path = directory / archive["archive_name"]
    contents = path.read_bytes()
    require(hashlib.sha256(contents).hexdigest() == archive["sha256"],
            f"Archive checksum differs: {path.name}")
    with zipfile.ZipFile(io.BytesIO(contents)) as report:
        members = report.namelist()
        require(len(members) == 1 and members[0].endswith(".csv"),
                f"Expected one CSV in {path.name}")
        rows = list(csv.DictReader(io.StringIO(report.read(members[0]).decode("utf-8-sig"))))
    require(len(rows) == archive["row_count"], f"Row count differs: {path.name}")
    return [{field: value.strip() for field, value in row.items()} for row in rows]


def verify_archives(fixture, directory):
    archives = fixture["source_archives"]
    reports = {key: read_report(directory, archive) for key, archive in archives.items()}
    for key, rows in fixture["published_dispatch_rows"].items():
        for row in rows:
            require(row in reports[key], f"Dispatch row missing from {key}: {row['SettlementPoint']}")
    for row in fixture["published_settlement_rows"]:
        require(row in reports["spp1845"], f"Settlement row missing: {row['SettlementPointName']}")
    for row in fixture["resource_node_replay"]["dispatch_intervals"]:
        report = reports[row["dispatch_price_adder_source"]]
        timestamp = datetime.fromisoformat(row["dispatch_timestamp_ct"]).strftime("%m/%d/%Y %H:%M:%S")
        require(len(report) == 1 and report[0]["SCEDTimestamp"] == timestamp
                and report[0]["RepeatedHourFlag"] == fixture["interval"]["published_key"]["DSTFlag"]
                and Decimal(report[0]["RTRDPA"]) == Decimal(row["energy_price_adder_usd_per_mwh"]),
                f"Price adder differs at {timestamp}")
    return len(reports)


def replay(fixture):
    interval = fixture["interval"]
    start = datetime.fromisoformat(interval["start_ct"])
    end = datetime.fromisoformat(interval["end_ct"])
    require((end - start).total_seconds() == 900, "Expected a single 15-minute settlement interval")

    example = fixture["resource_node_replay"]
    point = example["settlement_point"]
    slices = example["dispatch_intervals"]
    timestamps = [datetime.fromisoformat(row["dispatch_timestamp_ct"]) for row in slices]
    require(len(timestamps) >= 2 and timestamps == sorted(set(timestamps))
            and timestamps[0] <= start < timestamps[1] and timestamps[-1] < end,
            "Expected ordered dispatch intervals covering the settlement window")

    prices = []
    weights = []
    for row, run_start, next_run in zip(slices, timestamps, timestamps[1:] + [end], strict=True):
        seconds = int((next_run - max(start, run_start)).total_seconds())
        require(seconds > 0 and seconds == row["seconds_in_settlement_interval"],
                f"Dispatch weight differs at {run_start.isoformat()}")
        timestamp = run_start.strftime("%m/%d/%Y %H:%M:%S")
        source_rows = [source for source in fixture["published_dispatch_rows"][row["dispatch_lmp_source"]]
                       if source["SettlementPoint"] == point and source["SCEDTimestamp"] == timestamp
                       and source["RepeatedHourFlag"] == interval["published_key"]["DSTFlag"]]
        require(len(source_rows) == 1, f"Expected one dispatch price for {point} at {timestamp}")
        lmp = Decimal(source_rows[0]["LMP"])
        require(lmp == Decimal(row["lmp_usd_per_mwh"]), f"Dispatch price differs at {timestamp}")
        weights.append(seconds)
        prices.append(lmp + Decimal(row["energy_price_adder_usd_per_mwh"]))

    require(sum(weights) == 900, "Dispatch weights must span the full quarter-hour")
    weighted = cents(sum(price * seconds for price, seconds in zip(prices, weights, strict=True)) / 900)
    inside = [price for run, price in zip(timestamps, prices, strict=True) if run >= start]
    simple_average = cents(sum(inside) / len(inside))

    published = {}
    for row in fixture["published_settlement_rows"]:
        require(all(row[field] == value for field, value in interval["published_key"].items()),
                "Settlement point row belongs to a different delivery key")
        key = row["SettlementPointName"], row["SettlementPointType"]
        require(key not in published, f"Duplicate settlement point and type: {key}")
        published[key] = Decimal(row["SettlementPointPrice"])
    node = cents(published[(point, "RN")])
    require(weighted == node == example["weighted_rounded_usd_per_mwh"],
            f"Replay differs from the published {point} price")

    west_hub = published[("HB_WEST", "HU")]
    west_zone = published[("LZ_WEST", "LZ")]
    spread = cents(west_zone - west_hub)
    require(spread == fixture["west_load_zone_minus_west_hub_usd_per_mwh"], "West price spread differs")
    return {
        "interval": interval,
        "resource_node": point,
        "dispatch_seconds": weights,
        "time_weighted_usd_per_mwh": weighted,
        "in_window_runs_equal_weight_usd_per_mwh": simple_average,
        "posted_node_usd_per_mwh": node,
        "west_hub_usd_per_mwh": cents(west_hub),
        "west_load_zone_usd_per_mwh": cents(west_zone),
        "west_load_zone_minus_west_hub_usd_per_mwh": spread,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fixture", type=Path, default=FIXTURE,
                        help="JSON reference file, next to the script by default")
    parser.add_argument("--archives", type=Path,
                        help="Verify original ERCOT ZIPs saved under the archive_name entries in the fixture")
    args = parser.parse_args()
    try:
        fixture = json.loads(args.fixture.read_text(encoding="utf-8"))
        result = replay(fixture)
        result["source_archives_verified"] = verify_archives(fixture, args.archives) if args.archives else None
    except (OSError, ValueError, KeyError, TypeError, ArithmeticError, zipfile.BadZipFile) as error:
        parser.exit(1, f"Replay could not verify the case: {error}\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
