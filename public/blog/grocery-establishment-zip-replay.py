#!/usr/bin/env python3
"""Read grocery and convenience-store totals from a 2019–2023 Census ZBP detail archive."""

import argparse
import csv
import io
import json
import re
import zipfile
from pathlib import Path

INDUSTRIES = ("445110", "445120")
SIZE_BANDS = (
    "n<5", "n5_9", "n10_19", "n20_49", "n50_99", "n100_249",
    "n250_499", "n500_999", "n1000",
)


def read_counts(archive, zip_codes):
    fields = {"zip", "naics", "est", *SIZE_BANDS}
    matched = {}
    with zipfile.ZipFile(archive) as source:
        members = [name for name in source.namelist() if re.fullmatch(r"zbp(?:19|2[0-3])detail\.txt", name, re.I)]
        if len(members) != 1:
            raise ValueError("Expected one 2019–2023 zbpYYdetail.txt file in the archive.")
        with source.open(members[0]) as records:
            rows = csv.DictReader(io.TextIOWrapper(records, encoding="latin-1", newline=""))
            if not fields.issubset(rows.fieldnames or []):
                raise ValueError("The file lacks required fields from the 2019–2023 detail layout.")
            for row in rows:
                key = row["zip"], row["naics"]
                if key[0] not in zip_codes or key[1] not in INDUSTRIES:
                    continue
                if key in matched:
                    raise ValueError(f"Duplicate ZIP and industry row: {key!r}")
                matched[key] = row

    counts = []
    for zip_code in sorted(zip_codes):
        for naics in INDUSTRIES:
            row = matched.get((zip_code, naics))
            count = {
                "zip_code": zip_code,
                "naics_2017": naics,
                "row_status": "published" if row else "no_published_row",
                "establishments": int(row["est"]) if row else None,
            }
            if row:
                count["published_employment_size_fields"] = {band: row[band] for band in SIZE_BANDS}
            counts.append(count)
    return counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path, help="Census ZIP Code Industry Detail archive")
    parser.add_argument("zip_codes", nargs="+", help="Five-digit postal ZIP codes")
    args = parser.parse_args()
    if any(not re.fullmatch(r"[0-9]{5}", value) for value in args.zip_codes):
        parser.error("Provide five-digit ZIP codes with leading zeroes.")
    try:
        counts = read_counts(args.archive, set(args.zip_codes))
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        parser.exit(1, f"{error}\n")
    print(json.dumps(counts, indent=2))


if __name__ == "__main__":
    main()
