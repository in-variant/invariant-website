"""Replay a commercial property recorder cutoff, using three NYC ACRIS records."""

import argparse
import json
from datetime import date, datetime, timezone
from decimal import Decimal
from pathlib import Path
from urllib.request import urlopen


FIXTURE = Path(__file__).resolve().parents[1] / "public" / "blog" / "commercial-real-estate-data-apis-for-lenders.json"


def snapshot(records, cutoff):
    recorded_ids = {record["document_id"] for record in records if record["recorded_date"] <= cutoff}
    return {
        "cutoff_inclusive": cutoff,
        "included_document_ids": sorted(recorded_ids),
        "added_by_using_document_date_instead": sorted(
            record["document_id"]
            for record in records
            if record["document_date"] <= cutoff and record["document_id"] not in recorded_ids
        ),
    }


def fetch_rows(url):
    with urlopen(url, timeout=20) as response:
        rows = json.load(response)
    if not isinstance(rows, list):
        raise ValueError("Expected a list of ACRIS rows")
    return rows


def verify_live(records, bbl):
    observations = []
    for record in records:
        document_id = record["document_id"]
        master = fetch_rows(record["sources"]["master"])
        legals = fetch_rows(record["sources"]["legals"])
        parcel_match = any(
            row["document_id"] == document_id
            and f'{row["borough"]}{int(row["block"]):05d}{int(row["lot"]):04d}' == bbl
            for row in legals
        )
        if len(master) != 1 or master[0]["document_id"] != document_id:
            raise ValueError(f"Expected one ACRIS Master row for {document_id}")
        row = master[0]
        live_fields = {
            "city_register_file_number": row["crfn"],
            "document_type_code": row["doc_type"],
            "document_date": date.fromisoformat(row["document_date"][:10]).isoformat(),
            "recorded_date": date.fromisoformat(row["recorded_datetime"][:10]).isoformat(),
            "indexed_document_amount_usd": format(Decimal(row["document_amt"]).normalize(), "f"),
        }
        different_fields = [name for name, value in live_fields.items() if value != str(record[name])]
        observations.append({
            "document_id": document_id,
            "parcel_match": parcel_match,
            "fields": live_fields,
            "different_fields": different_fields,
        })
    return {
        "retrieved_at_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "matches_reference": all(item["parcel_match"] and not item["different_fields"] for item in observations),
        "observations": observations,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--as-of", type=date.fromisoformat, action="append", metavar="YYYY-MM-DD",
                        help="Add an inclusive recording cutoff. Defaults to the two case study dates.")
    parser.add_argument("--live", action="store_true", help="Check the reference records against current NYC Open Data")
    args = parser.parse_args()
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
    records = fixture["records"]
    reference_cutoffs = fixture["expected_cutoffs"]
    for check in reference_cutoffs:
        if snapshot(records, check["cutoff"])["included_document_ids"] != sorted(check["included_document_ids"]):
            parser.error(f"The fixture does not reproduce the reference cutoff {check['cutoff']}")

    cutoffs = [cutoff.isoformat() for cutoff in args.as_of] if args.as_of else [check["cutoff"] for check in reference_cutoffs]
    result = {
        "property": fixture["property"],
        "reference_checked_on": fixture["checked_on"],
        "scope": fixture["scope"],
        "records": records,
        "cutoffs": [snapshot(records, cutoff) for cutoff in cutoffs],
        "separate_issuer_disclosure": fixture["separate_issuer_disclosure"],
    }
    if args.live:
        try:
            result["live_acris_check"] = verify_live(records, fixture["property"]["borough_block_lot"])
        except (OSError, ValueError, KeyError, ArithmeticError) as error:
            result["live_acris_check"] = {"matches_reference": False, "error": str(error)}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return int(args.live and not result["live_acris_check"]["matches_reference"])


if __name__ == "__main__":
    raise SystemExit(main())
