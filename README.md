# Invariant

This repository contains the public website and research examples for [Invariant](https://invariant-ai.com/). The [Invariant Earth API](https://invariant-ai.com/product) links U.S. parcels, buildings, terrain, hazards and infrastructure to the records behind them.

- [API quickstart and authentication](https://docs.invariant-ai.com/quickstart)
- [Earth API field catalog](https://docs.invariant-ai.com/api/field-catalog)
- [Connect Earth to a coding agent over MCP](https://docs.invariant-ai.com/mcp/installation)
- [Official MCP Registry entry (JSON)](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.in-variant%2Finvariant-earth/versions/latest)
- [Research datasets and source records](https://invariant-ai.com/datasets)
- [Data guides by industry and use case](https://invariant-ai.com/blog/physical-world-data-by-use-case)

## Compare data providers on the same records

The [public vendor trial](https://invariant-ai.com/blog/physical-world-data-api-evaluation#reference-cases) gives buyers 16 dated cases across GIS, commercial property, underwriting, lending, power, logistics, wastewater and retail. Each case includes an input, a request, acceptance criteria and the original source links.

The [versioned case pack](https://github.com/in-variant/invariant-website/releases/tag/physical-world-data-api-trial-v1.0.0) includes JSON, the editable CSV and all 16 dated reference files. Unzip the pack and run `shasum -a 256 -c SHA256SUMS.txt` from its folder to verify the files. Run each request with your providers and record the entity, source date and any unresolved evidence in the CSV.

## Run the parcel and flood trial

The [GIS API trial](https://invariant-ai.com/blog/best-gis-apis-for-site-selection#gis-api-trial-requests) gives you the request bodies, dated city and FEMA references, and what to check in each response. Use it to evaluate parcel matching and flood overlap on the same sites across providers.

Download the [versioned GIS trial](https://github.com/in-variant/invariant-website/releases/tag/earth-gis-trial-v1.0.0) to get the Python script, reference files and checksums in one ZIP. Run the examples from the extracted folder or the repository root with Python 3.10 or newer. Each default run verifies the selected reference file and prints the dated observations and matching requests offline.

```bash
python3 examples/earth-gis-trial.py san-francisco
python3 examples/earth-gis-trial.py brooklyn-army-terminal
python3 examples/earth-gis-trial.py gowanus
```

| Case | What to check |
| --- | --- |
| `san-francisco` | Compare the city’s parcel number with the returned parcel identifier and preserve leading zeros. |
| `brooklyn-army-terminal` | Check whether the point is inside the returned lot and how the result handles a nearby parcel. |
| `gowanus` | Compare the address point, lot and building footprint against the dated FEMA overlay. |

For live responses, set `INVARIANT_API_KEY` in your environment using a [key from the Earth API console](https://docs.invariant-ai.com/get-api-key), then add `--live`.

```bash
python3 examples/earth-gis-trial.py gowanus --live
```

The output keeps the reference observations and live responses in separate fields. Use [the response reference](https://docs.invariant-ai.com/responses) to interpret match type, missing fields, and source dates.

## Replay two FEMA address checks

The [flood screening guide](https://invariant-ai.com/blog/data-center-flood-zone-screening#replay-fema-checks) covers 400 South Akard Street in Dallas and 655 North Franklin Street in Tampa. Download the script and dated records together from the [versioned flood screening release](https://github.com/in-variant/invariant-website/releases/tag/data-center-flood-screening-v1.0.0), or run them from this checkout.

```bash
python3 public/blog/data-center-flood-replay.py dallas
python3 public/blog/data-center-flood-replay.py tampa
```

The offline run verifies the SHA-256 of the reference file and prints the recorded findings. With `uv` and `curl` installed, repeat the queries against the agencies’ live map services.

```bash
uv run --with pyproj==3.8.0 --with shapely==2.2.0 public/blog/data-center-flood-replay.py tampa --live
```

The live run reports the point and parcel separately, checks the effective map panel, and remeasures the Tampa footprint and evacuation intersections. The `changed` list identifies differences from the dated findings. Exit status 2 means a finding changed, and status 1 means the comparison could not finish. Response checksums show whether the agency returned the same bytes. Keep the date and geographic scope with each result.

## Reproduce an ERCOT settlement price

The [ERCOT settlement replay](https://github.com/in-variant/invariant-website/releases/tag/ercot-settlement-price-replay-v1.0.1) bundles the selected dispatch and settlement rows, a Python script and checksums for the [worked pricing example](https://invariant-ai.com/blog/ercot-lmp-vs-settlement-point-price#replay-ercot-quarter-hour).

```bash
python3 public/blog/ercot-settlement-replay.py
```

The script calculates the four time weights and reproduces the posted $62.14/MWh at ALP_BESS_RN. To check the original reports, download the source archives with the URLs and names in the JSON and add `--archives ./ercot-reports`.

## Replay a commercial mortgage recording cutoff

The [commercial lending API guide](https://invariant-ai.com/blog/commercial-real-estate-data-apis-for-lenders#empire-state-building-recording-cutoff) uses three selected city recorder records at the Empire State Building. Replay the October 15 and October 22, 2013 snapshots and see which documents would appear early if you filtered by the date written on each instrument.

```bash
python3 examples/lending-recording-cutoff.py
python3 examples/lending-recording-cutoff.py --as-of 2013-10-21
python3 examples/lending-recording-cutoff.py --live
```

The first two commands use the bundled reference records and work offline. The optional live check reads NYC Open Data without a key and reports any fields that differ from the fixture. The example reconstructs the legal recording cutoff for those three instruments. Use vendor archives to check historical availability and the appropriate title and servicing records to verify priority and balances.

## Compare building permit APIs with city records

The [versioned building permit trial](https://github.com/in-variant/invariant-website/releases/tag/building-permit-api-trial-v1.0.0) bundles nine NYC and Seattle permit IDs, the Python comparison script, and a provider CSV template. Run the included example export to see how the trial reports missing permit IDs, conflicting rows and changes from the dated issuer reference. The release includes both observations of a Brooklyn permit whose reported expiration changed between city exports.

Use the [permit API comparison](https://invariant-ai.com/blog/building-permit-data-apis) to choose offices and cases. The [comparison workflow](https://docs.invariant-ai.com/test-building-permit-api) explains the CSV columns and how to interpret differences.

## Work on the website locally

With Node.js 22 and npm installed:

```bash
npm ci
npm run dev
```

Run `npm run build` to generate the production pages, sitemap and article feeds in `dist/`.

### Notify search engines after a release

Capture the live HTML before publishing to identify changes even when a page was edited twice on the same date.

```bash
npm run verify:release -- https://invariant-ai.com --capture-indexnow-baseline /tmp/invariant-indexnow-before.json
```

After the exact build is live, verify it and notify IndexNow of the new, changed and retired canonical URLs. Omit `--submit-indexnow` to review the list without sending it.

```bash
npm run verify:release -- https://invariant-ai.com --indexnow-from /tmp/invariant-indexnow-before.json --submit-indexnow
```
