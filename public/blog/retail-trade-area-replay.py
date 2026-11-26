#!/usr/bin/env python3
"""Replay Detroit trade-area household counts and 90% ACS sampling margins."""

import argparse
import csv
import json
import math
import sys
from pathlib import Path

REPLICATES = 80


def measure(zone):
    households = zone["measures"]["households"]
    estimates = (households["estimate"], *households["replicates"])
    if len(estimates) != REPLICATES + 1 or any(not math.isfinite(x) or x < 0 for x in estimates):
        raise ValueError("Expected one full household estimate and 80 valid matching replicates per zone.")
    return estimates


def margin(estimates):
    full, *replicates = estimates
    return 1.645 * math.sqrt(4 / REPLICATES * sum((x - full) ** 2 for x in replicates))


def replay(comparison):
    zones = comparison["zones"]
    existing, shared, candidate = [measure(zones[key]) for key in ("micahs_only", "shared", "whittier_only")]
    union = [sum(row) for row in zip(existing, shared, candidate, strict=True)]
    candidate_total = [a + b for a, b in zip(shared, candidate, strict=True)]
    if any(total == 0 for total in candidate_total):
        raise ValueError("The share replay needs a positive candidate household estimate in each replicate.")
    shared_pct = [100 * a / b for a, b in zip(shared, candidate_total, strict=True)]
    return {
        "drive_minutes": comparison["minutes"],
        "existing_only_households": round(existing[0], 2),
        "shared_households": round(shared[0], 2),
        "shared_households_90pct_sampling_margin": round(margin(shared), 2),
        "additional_households": round(candidate[0], 2),
        "additional_households_90pct_sampling_margin": round(margin(candidate), 2),
        "distinct_households": round(union[0], 2),
        "distinct_households_90pct_sampling_margin": round(margin(union), 2),
        "candidate_households_shared_percent": round(shared_pct[0], 4),
        "share_90pct_sampling_margin_percentage_points": round(margin(shared_pct), 4),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("snapshot", type=Path, help="Download detroit-retail-trade-area-overlap.json from the guide.")
    args = parser.parse_args()
    try:
        with args.snapshot.open(encoding="utf-8") as source:
            snapshot = json.load(source)
        results = [replay(item) for item in snapshot["comparisons"]]
        if not results:
            raise ValueError("The snapshot needs at least one comparison.")
    except (KeyError, OSError, TypeError, ValueError) as error:
        print(f"Replay could not complete: {error}", file=sys.stderr)
        return 1
    writer = csv.DictWriter(sys.stdout, fieldnames=results[0].keys(), lineterminator="\n")
    writer.writeheader()
    writer.writerows(results)
    return 0


if __name__ == "__main__":
    sys.exit(main())
