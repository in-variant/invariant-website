# FEMA flood map checks at two data center addresses

This package replays the record checks for 400 South Akard Street in Dallas and 655 North Franklin Street in Tampa. The reference captures the November 24, 2026 checks and the city, county, and FEMA source queries.

| Address | What the dated checks show |
| --- | --- |
| 400 South Akard Street, Dallas | The address point and mapped parcel were in FEMA Zone X. The footprint query did not resolve a matching building. |
| 655 North Franklin Street, Tampa | The address point, parcel, and matched footprint were in FEMA Zone X. The address point and parcel were also in the county's hurricane evacuation Zone C. |

The checks describe effective mapped flood hazards. Site drainage, equipment elevation, and the county's evacuation map answer separate questions. See the [flood screening guide](https://invariant-ai.com/blog/data-center-flood-zone-screening) and the [FEMA lookup workflow](https://docs.invariant-ai.com/check-flood-zone-by-address).

## Run the saved examples

Use Python 3.10 or later. Run these commands in the extracted directory.

```bash
python3 data-center-flood-replay.py dallas
python3 data-center-flood-replay.py tampa
```

The script verifies the saved JSON against its SHA-256 checksum before printing the reference observations. The JSON includes the retrieval date, map panels, attributes, and exact source URLs.

## Compare the live records

With `uv` and `curl` installed, run this command for either city. The live replay checks the agency endpoints and measures the matched polygons in an equal-area coordinate system.

```bash
uv run --with pyproj==3.8.0 --with shapely==2.2.0 data-center-flood-replay.py tampa --live
```

The output gives the reference results, current observations, and source response hashes. Exit status 2 indicates a change in the reported findings. Exit status 1 indicates a lookup or validation failure. A change in response bytes alone can reflect source metadata, geometry serialization, or a record update.

## Cite the release

Invariant. (2026). *FEMA flood map checks at two data center addresses* (v1.0.0) [Software and research data]. [GitHub release](https://github.com/in-variant/invariant-website/releases/tag/data-center-flood-screening-v1.0.0).
