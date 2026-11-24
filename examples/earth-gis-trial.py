"""Read one dated GIS reference case and optionally run the Earth API requests."""

import argparse
import hashlib
import json
import os
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener


PUBLIC_BLOG = Path(__file__).resolve().parents[1] / "public" / "blog"
FIXTURE = PUBLIC_BLOG / "gis-api-parcel-and-flood-trial.json"
EARTH_ENDPOINTS = {
    "https://api.invariant-ai.com/v1/enrich",
    "https://api.invariant-ai.com/v1/fetch",
}


class NoRedirects(HTTPRedirectHandler):
    """Keep the API key on the documented endpoints."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request_results(samples, key):
    opener = build_opener(NoRedirects())
    results = []
    for sample in samples:
        request = Request(
            sample["url"],
            data=json.dumps(sample["body"]).encode("utf-8"),
            headers={"X-API-Key": key, "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with opener.open(request, timeout=60) as response:
                result = {"http_status": response.status, "body": json.load(response)}
        except HTTPError as error:
            error.close()
            result = {"http_status": error.code, "error": "Earth API returned an HTTP error"}
        except (OSError, ValueError):
            result = {"error": "Could not read a JSON response from the Earth API"}
        results.append({"url": sample["url"], **result})
    return results


def main():
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
    cases = {case["id"]: case for case in fixture["cases"]}
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case", choices=cases, help="The reference site to inspect")
    parser.add_argument("--live", action="store_true", help="Send the requests using INVARIANT_API_KEY")
    args = parser.parse_args()

    case = cases[args.case]
    samples = case["requests"]
    if any(sample["method"] != "POST" or sample["url"] not in EARTH_ENDPOINTS for sample in samples):
        parser.error("The fixture contains an unexpected Earth API request")

    reference = fixture["reference_downloads"][args.case]
    reference_file = PUBLIC_BLOG / Path(urlsplit(reference["url"]).path).name
    if not reference_file.is_file():
        parser.error(f"Missing reference file {reference_file.name}")
    if hashlib.sha256(reference_file.read_bytes()).hexdigest() != reference["sha256"]:
        parser.error(f"The checksum does not match for {reference_file.name}")

    payload = {
        "case": args.case,
        "place": case["place"],
        "reference": case["reference"],
        "reference_download": reference,
        "review": case["review"],
        "requests": samples,
    }
    if args.live:
        key = os.environ.get("INVARIANT_API_KEY", "").strip()
        if not key:
            parser.error("Set INVARIANT_API_KEY before using --live")
        payload["responses"] = request_results(samples, key)

    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return int(any("error" in result for result in payload.get("responses", [])))


if __name__ == "__main__":
    raise SystemExit(main())
