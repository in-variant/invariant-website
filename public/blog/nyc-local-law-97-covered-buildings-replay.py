#!/usr/bin/env python3
"""Extract selected tax lots from the NYC DOB 2025 and 2026 CBL workbooks."""

import argparse
from hashlib import file_digest
import json
from pathlib import Path
import re
from xml.etree import ElementTree as ET
from zipfile import BadZipFile, ZipFile


NAMESPACE = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
DEFAULT_LOTS = ("1000260014", "1000297501", "1001530001")
SOURCES = {
    "2025": {
        "url": "https://home4.nyc.gov/assets/buildings/excel/cbl_cy25.xlsx",
        "worksheet": "LL97 CBL",
    },
    "2026": {
        "url": "https://home4.nyc.gov/assets/buildings/excel/cbl26.xlsx",
        "worksheet": "Sustainability_CBL",
    },
}


def tax_lot(value):
    if not re.fullmatch(r"[1-5][0-9]{9}", value):
        raise argparse.ArgumentTypeError("Expected a ten-digit NYC borough, block and lot (BBL)")
    return value


def values_for(row, shared):
    values = {}
    for cell in row:
        value = cell.findtext(NAMESPACE + "v")
        if value is not None:
            column = cell.attrib["r"].rstrip("0123456789")
            values[column] = shared[int(value)] if cell.get("t") == "s" else value
    return values


def read_workbook(path, year, tax_lots):
    expected_columns = {
        "2025": {"A": "BBL", "B": "Preliminary BIN", "C": "Address", "H": "CP3: Article 321"},
        "2026": {"A": "BBL", "B": "BIN", "C": "On LL97 CBL (Y/N)", "D": "LL97 Compliance Pathway"},
    }[year]
    with path.open("rb") as file:
        digest = file_digest(file, "sha256").hexdigest()
    records = {number: [] for number in tax_lots}
    with ZipFile(path) as archive:
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        worksheets = workbook.findall(f".//{NAMESPACE}sheet")
        if len(worksheets) < 2 or worksheets[1].get("name") != SOURCES[year]["worksheet"]:
            raise ValueError(f"Expected the {year} NYC DOB covered buildings workbook in {path}")
        shared = [
            "".join(text.text or "" for text in item.iter(NAMESPACE + "t"))
            for item in ET.fromstring(archive.read("xl/sharedStrings.xml"))
        ]
        with archive.open("xl/worksheets/sheet2.xml") as stream:
            sheet_data = None
            for event, element in ET.iterparse(stream, events=("start", "end")):
                if event == "start" and element.tag == NAMESPACE + "sheetData":
                    sheet_data = element
                if event != "end" or element.tag != NAMESPACE + "row":
                    continue
                row_number = int(element.attrib["r"])
                values = values_for(element, shared)
                sheet_data.remove(element)
                if row_number == 1:
                    if not all(
                        values.get(col, "").strip().startswith(label)
                        for col, label in expected_columns.items()
                    ):
                        raise ValueError(f"Unexpected {year} NYC DOB worksheet column headers")
                    continue
                bbl = values.get("A")
                if bbl in records:
                    records[bbl].append({"worksheet_row": row_number, "cells": values})
    return {**SOURCES[year], "sha256": digest}, records


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workbook_2025", type=Path)
    parser.add_argument("workbook_2026", type=Path)
    parser.add_argument("--bbl", type=tax_lot, action="append", help="Repeat for each tax lot")
    arguments = parser.parse_args()

    lots = dict.fromkeys(arguments.bbl or DEFAULT_LOTS)
    try:
        source_2025, rows_2025 = read_workbook(arguments.workbook_2025, "2025", lots)
        source_2026, rows_2026 = read_workbook(arguments.workbook_2026, "2026", lots)
    except (OSError, ValueError, KeyError, IndexError, BadZipFile, ET.ParseError) as error:
        parser.error(str(error))

    print(json.dumps({
        "title": "NYC Local Law 97 coverage by tax lot and building ID",
        "publisher": "Invariant",
        "article": "https://invariant-ai.com/blog/nyc-local-law-97-building-lookup",
        "scope": "Exact BBL matches in two public NYC DOB workbooks. Empty arrays mean no exact BBL row. Worksheet cells report published coverage and pathway, with filing status and assessed penalties outside the scope.",
        "sources": {"2025": source_2025, "2026": source_2026},
        "records_by_bbl": {
            bbl: {"2025": rows_2025[bbl], "2026": rows_2026[bbl]}
            for bbl in lots
        },
    }, indent=2))


if __name__ == "__main__":
    main()
