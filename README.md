# Invariant

This repository contains the public website and research examples for [Invariant](https://invariant-ai.com/). The [Invariant Earth API](https://invariant-ai.com/product) links U.S. parcels, buildings, terrain, hazards and infrastructure to the records behind them.

- [API quickstart and authentication](https://docs.invariant-ai.com/quickstart)
- [Earth API field catalog](https://docs.invariant-ai.com/api/field-catalog)
- [Connect Earth to a coding agent over MCP](https://docs.invariant-ai.com/mcp/installation)
- [Research datasets and source records](https://invariant-ai.com/datasets)
- [Data guides by industry and use case](https://invariant-ai.com/blog/physical-world-data-by-use-case)

## Run the parcel and flood trial

The [GIS API trial](https://invariant-ai.com/blog/best-gis-apis-for-site-selection#gis-api-trial-requests) gives you the request bodies, dated city and FEMA references, and what to check in each response. Use it to evaluate parcel matching and flood overlap on the same sites across providers.

From the repository root, run the example with Python 3.10 or newer. The default run checks the reference file’s SHA-256 and prints its dated observations and the matching request bodies. It works offline and needs no API key.

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

## Work on the website locally

With Node.js 22 and npm installed:

```bash
npm ci
npm run dev
```

Run `npm run build` to generate the production pages, sitemap and article feeds in `dist/`.
