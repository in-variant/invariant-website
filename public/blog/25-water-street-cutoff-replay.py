#!/usr/bin/env python3
"""Rebuild the 25 Water Street example from the saved NYC source rows."""

import argparse
import json
from datetime import date
from pathlib import Path


SNAPSHOT_NAME = "25-water-street-point-in-time-property-records.json"


def calendar_date(value):
    parsed = date.fromisoformat(value)
    if parsed.isoformat() != value:
        raise ValueError("Expected YYYY-MM-DD")
    return parsed


def partition_by_date(rows, field, cutoff):
    eligible, undated = [], []
    for row in rows:
        value = row.get(field)
        if value is None or value == "":
            undated.append(row)
        elif calendar_date(value) <= cutoff:
            eligible.append(row)
    return sorted(eligible, key=lambda row: row[field]), undated


def rebuild(snapshot, cutoff):
    issuances, undated_issuances = partition_by_date(
        snapshot["occupancy_issuances"], "issued_date", cutoff
    )
    recorder_rows = snapshot["selected_recorder_rows"]
    recorded, undated_recordings = partition_by_date(
        recorder_rows, "recorded_date", cutoff
    )
    dated_documents, undated_documents = partition_by_date(
        recorder_rows, "document_date", cutoff
    )
    latest_date = issuances[-1]["issued_date"] if issuances else None
    recorded_ids = {row["document_id"] for row in recorded}
    return {
        "cutoff_date": cutoff.isoformat(),
        "occupancy_issuance_count": len(issuances),
        "latest_eligible_issuances": [
            row for row in issuances if row["issued_date"] == latest_date
        ],
        "selected_recording_count": len(recorded),
        "selected_recordings": recorded,
        "selected_count_using_document_date": len(dated_documents),
        "dated_by_cutoff_but_recorded_later": [
            row for row in dated_documents
            if row.get("recorded_date") and row["document_id"] not in recorded_ids
        ],
        "rows_without_dates": {
            "issued_date": [row["certificate_number"] for row in undated_issuances],
            "recorded_date": [row["document_id"] for row in undated_recordings],
            "document_date": [row["document_id"] for row in undated_documents],
        },
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--snapshot",
        type=Path,
        default=Path(__file__).with_name(SNAPSHOT_NAME),
        help="Path to the saved 25 Water Street JSON",
    )
    parser.add_argument(
        "--as-of", type=calendar_date, action="append",
        help="Inclusive cutoff in YYYY-MM-DD. Repeat to compare dates.",
    )
    args = parser.parse_args()

    try:
        snapshot = json.loads(args.snapshot.read_text(encoding="utf-8"))
        cutoffs = args.as_of or [
            calendar_date(row["cutoff_date"]) for row in snapshot["cutoffs"]
        ]
        result = {
            "property": snapshot["property"],
            "source_observed_on": {
                name: snapshot["queries"][name]["observed_on"]
                for name in ("occupancy", "master")
            },
            "scope": {
                "recordings": "The selected instruments in the saved mortgage-chain study.",
                "visibility": "An event-date reconstruction from a later extract.",
                "parcel": "The later MapPLUTO edition is excluded.",
            },
            "cutoffs": [rebuild(snapshot, cutoff) for cutoff in cutoffs],
        }
    except (KeyError, OSError, TypeError, ValueError) as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
