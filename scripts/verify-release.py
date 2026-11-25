"""Compare an HTTP deployment with the previously built release in dist/."""

import argparse
import json
import re
import sys
from collections import deque
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
from subprocess import run
from urllib.error import HTTPError
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
CANONICAL = "https://invariant-ai.com"
SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
ATOM_NS = "{http://www.w3.org/2005/Atom}"
FEED_PATH = "/feed.xml"
DATASET_INDEX_PATH = "/datasets.json"
DATASET_CITATIONS_PATH = "/datasets.csl.json"
COVERAGE_FIELDS_PATH = "/data-coverage-fields.json"
AGENT_INDEX_PATHS = frozenset(("/llms.txt", "/llms-index.txt", "/llms-full.txt"))
SAMPLE = (
    "/", "/product", "/data-coverage", "/blog", "/resources", "/research", "/datasets",
    "/blog/data-center-site-selection-checklist",
    "/glossary/data-center-site-selection",
    "/calculators/nrc-license-timeline",
)
MISSING = (
    "/__release-check-missing__", "/blog/__release-check-missing__",
    "/glossary/__release-check-missing__", "/blog/__release-check-missing__.geojson",
)
RETIRED = (
    "/blog/fermibench-sota", "/glossary/fermi-bench", "/glossary/helion-512",
    "/blog/nuclear-compliance-tam", "/blog/space-compliance-tam",
    "/ai-for-nuclear-compliance", "/ai-for-space-compliance",
)
CRAWLER_USER_AGENTS = (
    "Googlebot/2.1", "bingbot/2.0", "OAI-SearchBot/1.4", "Claude-SearchBot/1.0", "PerplexityBot/1.0",
)
CRAWLER_SMOKE_PATHS = frozenset((
    "/robots.txt", "/product", "/product.md", "/blog", "/blog/data-center-site-selection-checklist",
    "/blog/index.html", "/blog/data-center-site-selection-checklist/index.html",
    "/blog/data-center-site-selection-checklist.md", "/research", "/research.md",
    "/datasets", "/datasets.md", DATASET_INDEX_PATH, FEED_PATH,
    "/data-coverage", "/data-coverage.md", COVERAGE_FIELDS_PATH,
    "/blog/", "/product/", "/datasets/", "/data-coverage/",
)) | AGENT_INDEX_PATHS
NON_CONTENT_TEXT_TAGS = frozenset(("script", "style", "noscript"))
SEARCH_METADATA = ("description", "og:url", "og:title", "og:description", "og:image", "twitter:image")
ASSET_MIME_TYPES = {
    ".css": ("text/css",),
    ".js": ("text/javascript", "application/javascript"),
    ".jpg": ("image/jpeg",),
    ".png": ("image/png",),
    ".svg": ("image/svg+xml",),
    ".webp": ("image/webp",),
    ".woff2": ("font/woff2",),
}


class ReadResponseWithoutRedirecting(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class Page(HTMLParser):
    def __init__(self, path, html):
        super().__init__()
        self.url = CANONICAL + path
        self.canonical = []
        self.robots = []
        self.headings = []
        self.links = set()
        self.main_links = set()
        self.fragment_links = set()
        self.ids = []
        self.downloads = set()
        self.markdown = []
        self.feeds = []
        self.schemas = []
        self.titles = []
        self.metadata = {key: [] for key in SEARCH_METADATA}
        self.assets = set()
        self.in_main = False
        self.excluded_text_depth = 0
        self.main_text_parts = []
        self.heading = None
        self.schema = None
        self.title = None
        self.feed(html.decode("utf-8"))
        self.close()
        self.main_text = " ".join(" ".join(self.main_text_parts).split())

    def handle_starttag(self, tag, attributes):
        attr = dict(attributes)
        if attr.get("id"):
            self.ids.append(attr["id"])
        if tag in NON_CONTENT_TEXT_TAGS:
            self.excluded_text_depth += 1
        if tag == "main":
            self.in_main = True
        elif tag == "title":
            self.title = []
        elif tag == "h1" and self.in_main:
            self.heading = []
        elif tag == "br" and self.heading is not None:
            self.heading.append(" ")
        elif tag == "a" and attr.get("href"):
            target = urlsplit(urljoin(self.url, attr["href"]))
            if self.in_main and target.scheme in {"http", "https"}:
                self.main_links.add(target.geturl())
            if target.netloc == urlsplit(CANONICAL).netloc:
                self.links.add(target.path)
                if target.fragment:
                    self.fragment_links.add((target.path, target.fragment))
                if "download" in attr:
                    self.downloads.add(target.path)
        elif tag == "link":
            rel = attr.get("rel")
            if rel == "canonical":
                self.canonical.append(attr.get("href"))
            if rel == "alternate" and attr.get("type") == "text/markdown":
                self.markdown.append(attr["href"])
            if rel == "alternate" and attr.get("type") == "application/atom+xml":
                self.feeds.append(attr["href"])
            if rel in {"stylesheet", "modulepreload"} or (rel == "preload" and attr.get("as") in {"font", "image", "script", "style"}):
                self.add_asset(attr.get("href"))
        elif tag == "meta":
            name = (attr.get("name") or attr.get("property") or "").lower()
            if name in {"robots", "googlebot", "bingbot"}:
                self.robots.append(attr.get("content", ""))
            if name in self.metadata:
                self.metadata[name].append(attr.get("content") or "")
            if name in {"og:image", "twitter:image"}:
                self.add_asset(attr.get("content"))
        elif tag == "script":
            if attr.get("type") == "application/ld+json":
                self.schema = []
            self.add_asset(attr.get("src"))
        elif tag == "img":
            self.add_asset(attr.get("src"))
            for candidate in attr.get("srcset", "").split(","):
                fields = candidate.split()
                if fields:
                    self.add_asset(fields[0])

    def add_asset(self, reference):
        if reference:
            target = urlsplit(urljoin(self.url, reference))
            if target.scheme in {"http", "https"} and target.netloc == urlsplit(CANONICAL).netloc:
                self.assets.add(target.path + (f"?{target.query}" if target.query else ""))

    def handle_data(self, data):
        if self.in_main and self.excluded_text_depth == 0:
            self.main_text_parts.append(data)
        if self.heading is not None:
            self.heading.append(data)
        if self.schema is not None:
            self.schema.append(data)
        if self.title is not None:
            self.title.append(data)

    def handle_endtag(self, tag):
        if tag in NON_CONTENT_TEXT_TAGS:
            self.excluded_text_depth -= 1
        if tag == "main":
            self.in_main = False
        elif tag == "h1" and self.heading is not None:
            self.headings.append(" ".join("".join(self.heading).split()))
            self.heading = None
        elif tag == "script" and self.schema is not None:
            self.schemas.append(json.loads("".join(self.schema)))
            self.schema = None
        elif tag == "title" and self.title is not None:
            self.titles.append(" ".join("".join(self.title).split()))
            self.title = None


def excludes_indexing(values):
    return any(re.search(r"\b(?:noindex|none)\b", value, re.IGNORECASE) for value in values)


def sitemap_entries(xml):
    root = ElementTree.fromstring(xml)
    entries = {}
    for node in root.findall(f"{SITEMAP_NS}url"):
        loc = node.findtext(f"{SITEMAP_NS}loc")
        if not loc or loc in entries:
            raise ValueError("sitemap contains a missing or duplicate URL")
        entries[loc] = node.findtext(f"{SITEMAP_NS}lastmod")
    if not entries:
        raise ValueError("sitemap is empty")
    return entries


def fetch(origin, path, crawler=None, *, method="GET"):
    opener = build_opener(ReadResponseWithoutRedirecting())
    agent = f"Mozilla/5.0 (compatible; {crawler})" if crawler else "Invariant Website Release Audit"
    req = Request(origin + path, headers={"User-Agent": agent}, method=method)
    try:
        response = opener.open(req, timeout=15)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.headers, response.read()


def require(condition, issue):
    if not condition:
        raise ValueError(issue)


def require_success(status, headers, mime):
    require(status == 200, f"HTTP {status}, expected 200")
    if mime:
        require(headers.get_content_type() == mime, f"expected {mime}, got {headers.get_content_type()}")


def search_signature(page):
    fields = (page.main_text, page.titles, page.metadata, page.schemas, sorted(page.main_links))
    return sha256(json.dumps(fields, sort_keys=True).encode("utf-8")).hexdigest()


def capture_indexnow_baseline(destination):
    status, headers, body = fetch(CANONICAL, "/sitemap.xml")
    require_success(status, headers, "application/xml")
    sitemap = sitemap_entries(body)

    def snapshot(url):
        path = urlsplit(url).path or "/"
        require(url == CANONICAL + path, f"noncanonical URL in the live sitemap: {url}")
        status, headers, body = fetch(CANONICAL, path)
        require_success(status, headers, "text/html")
        page = Page(path, body)
        require(page.main_text and page.canonical == [url] and
                not excludes_indexing(page.robots + headers.get_all("X-Robots-Tag", [])),
                f"cannot capture an indexable canonical page for {url}")
        return url, search_signature(page)

    with ThreadPoolExecutor(max_workers=6) as pool:
        pages = dict(pool.map(snapshot, sorted(sitemap)))
    destination.write_text(json.dumps({"origin": CANONICAL, "pages": pages}, indent=2) + "\n", encoding="utf-8")
    print(f"Saved search content from {len(pages)} live canonical pages to {destination}.")


def indexnow_changes(baseline_path, jobs):
    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
    previous = baseline["pages"]
    require(baseline["origin"] == CANONICAL and isinstance(previous, dict) and bool(previous),
            "expected a nonempty live baseline captured for the canonical origin")
    current = {CANONICAL + path: search_signature(page) for path, kind, page in jobs if kind == "page"}
    removed = {CANONICAL + path for path, kind, _ in jobs if kind == "missing" and path in RETIRED}
    return sorted({url for url, signature in current.items() if previous.get(url) != signature}
                  | (previous.keys() & removed))


def verify(origin, job, expected_urls, preview, crawler=None):
    path, kind, expected = job
    try:
        status, headers, body = fetch(origin, path, crawler, method="HEAD" if kind == "asset" else "GET")
        header_noindex = excludes_indexing(headers.get_all("X-Robots-Tag", []))
        if kind == "redirect":
            code, destination = expected
            require(status == code, f"HTTP {status}, expected {code} to {destination}")
            require(urljoin(origin + path, headers.get("Location", "")) == urljoin(origin, destination),
                    f"wrong redirect destination, expected {destination}")
        elif kind == "missing":
            require(status == 404, f"HTTP {status}, expected 404")
            require(headers.get_content_type() == "text/html", "custom 404 HTML is missing")
            actual = Page(path, body)
            require(actual.headings == expected.headings, "custom 404 heading is missing")
            require(not actual.canonical, "404 contains a canonical URL")
        elif kind == "sitemap":
            require_success(status, headers, "application/xml")
            actual_entries = sitemap_entries(body)
            missing = expected.keys() - actual_entries.keys()
            extra = actual_entries.keys() - expected.keys()
            require(not missing and not extra, f"sitemap differs by {len(missing)} missing and {len(extra)} extra URLs")
            stale = sorted(url for url, lastmod in expected.items() if actual_entries[url] != lastmod)
            require(not stale, f"sitemap lastmod differs from dist/ for {len(stale)} URLs: {', '.join(stale[:3])}")
        elif kind == "feed":
            require_success(status, headers, "application/atom+xml")
            require(body == expected, "Atom feed differs from dist/")
        elif kind == "dataset-index":
            require_success(status, headers, "application/json")
            require(body == expected and header_noindex, "dataset metadata differs from dist/ or is missing noindex")
        elif kind == "asset":
            require_success(status, headers, None)
            mime = headers.get_content_type()
            require(mime in expected, f"asset Content-Type {mime}, expected {' or '.join(expected)}")
        elif kind in ("file", "markdown"):
            mime = "text/markdown" if kind == "markdown" else "text/plain" if path == "/robots.txt" or path in AGENT_INDEX_PATHS else None
            require_success(status, headers, mime)
            require(body == expected, "response bytes differ from dist/")
            if kind == "markdown":
                require(header_noindex, "missing X-Robots-Tag noindex on Markdown")
        else:
            require_success(status, headers, "text/html")
            actual = Page(path, body)
            if kind == "shell":
                require(not actual.canonical and excludes_indexing(actual.robots),
                        "client-only entry needs an explicit noindex and no canonical")
            else:
                require(actual.headings == expected.headings and len(actual.headings) == 1 and bool(actual.headings[0]),
                        f"initial HTML heading differs from dist/ (expected {expected.headings})")
                require(actual.main_text and actual.main_text == expected.main_text and actual.main_text != actual.headings[0],
                        "initial HTML main text is missing or differs from dist/")
                require(actual.main_links == expected.main_links, "initial HTML content links differ from dist/")
                require(actual.canonical == [CANONICAL + path], "missing, duplicate, or incorrect canonical")
                require(actual.titles == expected.titles, "search title is missing, duplicated, or differs from dist/")
                for key, content in expected.metadata.items():
                    require(actual.metadata[key] == content, f"{key} is missing, duplicated, or differs from dist/")
                require(actual.assets == expected.assets, "initial HTML asset references differ from dist/")
                require(not excludes_indexing(actual.robots), "page contains noindex in HTML")
                require(preview or not header_noindex, "public page sends X-Robots-Tag noindex")
                require(actual.schemas == expected.schemas, "structured data differs from dist/")
                require(actual.markdown == expected.markdown, "Markdown alternate differs from dist/")
                require(actual.feeds == expected.feeds, "Atom discovery link differs from dist/")
                missing_links = {
                    link for link in expected.links - actual.links if CANONICAL + link in expected_urls
                }
                require(not missing_links, f"missing initial HTML link(s): {', '.join(sorted(missing_links)[:3])}")
                require(expected.downloads <= actual.downloads, "expected download link is missing")
    except (OSError, ValueError, KeyError, ElementTree.ParseError) as error:
        profile = f" [{crawler}]" if crawler else ""
        return f"{path}{profile}  {error}"
    return None


def verify_discovery(pages):
    require("/" in pages, "homepage is missing from the sitemap")
    reached = {"/"}
    pending = deque(reached)
    while pending:
        discovered = (pages[pending.popleft()].links & pages.keys()) - reached
        reached.update(discovered)
        pending.extend(discovered)
    unreachable = sorted(pages.keys() - reached)
    require(not unreachable, f"{len(unreachable)} sitemap pages unreachable from the homepage through initial HTML links: "
            f"{', '.join(unreachable[:5])}")


def verify_agent_links(files, pages):
    local_links = re.compile(r"\]\(<?(https://invariant-ai\.com(?:/[^<>\s)]*)?)(?=[>\s)])")
    for path in sorted(files):
        contents = (DIST / path.lstrip("/")).read_text(encoding="utf-8")
        for href in local_links.findall(contents):
            target = urlsplit(href)
            destination = unquote(target.path) or "/"
            require(destination in pages or (DIST / destination.lstrip("/")).is_file(),
                    f"{path} links to a missing file or canonical page: {href}")
            fragment = unquote(target.fragment).split(":~:", 1)[0]
            if fragment and destination in pages:
                require(fragment in pages[destination].ids, f"{path} links to a missing fragment: {href}")


def verify_search_metadata(pages):
    titles = {}
    for path, page in pages.items():
        require(len(page.titles) == 1 and bool(page.titles[0]), f"{path} needs one search title")
        for key, values in page.metadata.items():
            require(len(values) == 1 and bool(values[0].strip()), f"{path} needs one {key} tag")
        require(page.metadata["og:url"] == [CANONICAL + path], f"{path} has an incorrect og:url")
        title = page.titles[0]
        require(title not in titles, f"{path} shares its search title with {titles.get(title)}")
        titles[title] = path


def dataset_nodes(value):
    if isinstance(value, dict):
        types = value.get("@type")
        if types == "Dataset" or isinstance(types, list) and "Dataset" in types:
            yield value
        for child in value.values():
            yield from dataset_nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from dataset_nodes(child)


def verify_dataset_catalog(catalog, pages):
    schemas = [item for item in catalog.schemas if item.get("@type") == "DataCatalog"]
    require(len(schemas) == 1, "research page must describe one DataCatalog")
    schema = schemas[0]
    require(schema.get("url") == catalog.url and bool(schema.get("name")), "DataCatalog needs its canonical URL and name")
    require("dataset" not in schema, "catalog lists links while individual guides describe the Datasets")
    identity = {key: schema[key] for key in ("@type", "@id", "name", "url")}
    collection_pages = [item for item in catalog.schemas if item.get("@type") == "CollectionPage"]
    require(len(collection_pages) == 1, "research page needs one CollectionPage")
    collection = collection_pages[0]
    require(collection.get("url") == catalog.url and collection.get("about") == {"@id": schema["@id"]},
            "CollectionPage needs to refer to the canonical DataCatalog")
    listing = collection["mainEntity"]
    require(listing.get("@type") == "ItemList", "CollectionPage needs an ItemList of dataset links")
    expected_names = {}
    for i, item in enumerate(listing["itemListElement"], 1):
        require(item.get("@type") == "ListItem" and item.get("position") == i, "dataset list item is out of order")
        require(item["url"] not in expected_names and item["name"], "dataset links must have distinct URLs and names")
        expected_names[item["url"]] = item["name"]
    actual_names = {}
    markdown = (DIST / "datasets.md").read_text(encoding="utf-8")
    manifest = json.loads((DIST / DATASET_INDEX_PATH.lstrip("/")).read_bytes())
    require(manifest["url"] == catalog.url and DATASET_INDEX_PATH in catalog.downloads,
            "JSON dataset index needs the canonical catalog and a visible download link")
    records = {entry["url"]: entry for entry in manifest["datasets"]}
    require(len(records) == len(manifest["datasets"]) and records.keys() == expected_names.keys(),
            "JSON dataset index differs from the HTML listing")
    citation_entries = json.loads((DIST / DATASET_CITATIONS_PATH.lstrip("/")).read_bytes())
    citations = {entry["id"]: entry for entry in citation_entries}
    require(DATASET_CITATIONS_PATH in catalog.downloads and f"]({CANONICAL}{DATASET_CITATIONS_PATH})" in markdown,
            "dataset catalogs need direct downloads for the citation library")
    require(len(citations) == len(citation_entries) and citations.keys() == records.keys(),
            "citation library must contain each dataset exactly once")
    for url, record in records.items():
        attribution = record["sourceDetails"]
        require([source["url"] for source in attribution] == record["sources"] and attribution
                and all(source["title"].strip() and source["publisher"].strip()
                        and f"](<{source['url']}>)" in markdown for source in attribution),
                f"{url} has missing or inaccurate source records")
        entry = citations[url]
        published = record.get("datePublished", record["guide"]["published"])
        require(entry["URL"] == url and entry["title"] == record["name"] and entry["type"] == "dataset"
                and entry["author"] == [{"literal": "Invariant"}]
                and entry["issued"]["date-parts"] == [[int(part) for part in published.split("-")]],
                f"{url} has inconsistent citation metadata")
    for path, page in pages.items():
        registered_downloads = set()
        for dataset in dataset_nodes(page.schemas):
            require(path.startswith("/blog/"), f"{page.url} describes a Dataset outside its canonical guide")
            name, description = dataset.get("name"), dataset.get("description")
            require(isinstance(name, str) and name.strip() and isinstance(description, str)
                    and 50 <= len(description.strip()) <= 5000,
                    f"{page.url} has Dataset markup with a missing name or invalid description")
            require(dataset.get("includedInDataCatalog") == identity, f"{page.url} has an incomplete DataCatalog reference")
            anchor = urlsplit(dataset["url"]).fragment
            require(re.fullmatch(r"dataset(?:-[a-z0-9]+)*", anchor) and page.ids.count(anchor) == 1
                    and dataset["url"] == dataset["@id"] == dataset["identifier"] == f"{page.url}#{anchor}"
                    and dataset["url"] not in actual_names, f"{page.url} has an invalid or duplicate dataset URL")
            require((path, anchor) in catalog.fragment_links, f"{dataset['url']} is missing from the HTML dataset catalog")
            require(f"]({dataset['url']})" in markdown, f"{page.url} is missing from the Markdown dataset catalog")
            record = records[dataset["url"]]
            require(record["name"] == dataset["name"] and record["description"] == dataset["description"]
                    and record["sources"] == dataset["isBasedOn"]
                    and record.get("datePublished", record["guide"]["published"]) == dataset["datePublished"],
                    f"{dataset['url']} has inconsistent JSON dataset metadata")
            reuse = record.get("sourceReuse")
            if reuse:
                reuse_anchor = f"{anchor}-reuse"
                require(dataset.get("usageInfo") == f"{page.url}#{reuse_anchor}" and page.ids.count(reuse_anchor) == 1,
                        f"{dataset['url']} needs a visible usage note matching its structured data")
            downloads = {file["url"]: file for file in record["downloads"]}
            require(len(downloads) == len(record["downloads"]) and downloads.keys() == {
                file["contentUrl"] for file in dataset["distribution"]
            }, f"{page.url} has inconsistent JSON dataset download links")
            for file in dataset["distribution"]:
                require(file["contentUrl"] not in registered_downloads and urlsplit(file["contentUrl"]).path in page.downloads,
                        f"{file['contentUrl']} is missing from the guide or belongs to two datasets")
                registered_downloads.add(file["contentUrl"])
                require(f"]({file['contentUrl']})" in markdown,
                        f"{file['contentUrl']} is missing from the Markdown dataset catalog")
                entry = downloads[file["contentUrl"]]
                contents = (DIST / urlsplit(entry["url"]).path.lstrip("/")).read_bytes()
                require(entry["bytes"] == len(contents) and entry["sha256"] == sha256(contents).hexdigest(),
                        f"{entry['url']} checksum or size differs from dist/")
            actual_names[dataset["url"]] = dataset["name"]
    require(actual_names and actual_names == expected_names, "catalog links differ from the published Dataset pages")


def verify_blog_feed(blog, xml, expected_urls):
    require(blog.feeds == [FEED_PATH] and FEED_PATH in blog.links, "blog is missing its Atom feed links")
    feed = ElementTree.fromstring(xml)
    self_link = feed.find(f"{ATOM_NS}link[@rel='self']")
    require(feed.tag == f"{ATOM_NS}feed" and self_link is not None and self_link.get("href") == CANONICAL + FEED_PATH,
            "Atom feed has an invalid namespace or self URL")
    lookup = {}
    for filename in ("industry-article-index.json", "legacy-blog-articles.json"):
        for article in json.loads((ROOT / "src/data" / filename).read_text(encoding="utf-8")):
            lookup[f"{CANONICAL}/blog/{article['slug']}"] = article
    entries = feed.findall(f"{ATOM_NS}entry")
    ids = [entry.findtext(f"{ATOM_NS}id") for entry in entries]
    require(set(ids) == lookup.keys() and len(ids) == len(lookup) and set(ids) <= expected_urls,
            "Atom feed must include every canonical blog article once")
    updated = []
    for url, entry in zip(ids, entries):
        article = lookup[url]
        link = entry.find(f"{ATOM_NS}link[@rel='alternate']")
        require(link is not None and link.get("href") == url, f"{url} has an incorrect Atom link")
        require(entry.findtext(f"{ATOM_NS}title") == article["title"] and
                entry.findtext(f"{ATOM_NS}summary") == article["summary"], f"{url} has incorrect Atom text")
        published = f"{article['dateTime']}T00:00:00Z"
        revised = f"{article.get('updatedDate', article['dateTime'])}T00:00:00Z"
        require(entry.findtext(f"{ATOM_NS}published") == published and entry.findtext(f"{ATOM_NS}updated") == revised,
                f"{url} has incorrect Atom dates")
        updated.append(revised)
    require(updated == sorted(updated, reverse=True) and feed.findtext(f"{ATOM_NS}updated") == updated[0],
            "Atom feed has incorrect revision ordering")


def build_jobs(sitemap, full):
    expected_urls = set(sitemap)
    path_set = {urlsplit(url).path for url in expected_urls}
    catalog = Page("/datasets", (DIST / "datasets/index.html").read_bytes())
    research = {path for path in catalog.links if path.startswith("/blog/") and CANONICAL + path in expected_urls}
    candidates = sorted(path_set if full else set(SAMPLE) | research)
    require(set(candidates) <= path_set, "sample paths missing from the local build")
    jobs = [("/sitemap.xml", "sitemap", sitemap)]
    alternate_files = set()
    downloads = catalog.downloads.copy()
    assets = set()
    pages = {}
    for path in candidates:
        page = Page(path, (DIST / path.lstrip("/") / "index.html").read_bytes())
        jobs.append((path, "page", page))
        alternate_files.update(page.markdown)
        downloads.update(page.downloads)
        assets.update(page.assets)
        pages[path] = page
    verify_search_metadata(pages)
    verify_dataset_catalog(catalog, pages)
    feed = (DIST / FEED_PATH.lstrip("/")).read_bytes()
    verify_blog_feed(pages["/blog"], feed, expected_urls)
    jobs.append((FEED_PATH, "feed", feed))
    for path in (DATASET_INDEX_PATH, DATASET_CITATIONS_PATH, COVERAGE_FIELDS_PATH):
        jobs.append((path, "dataset-index", (DIST / path.lstrip("/")).read_bytes()))
        downloads.discard(path)
    if full:
        verify_discovery(pages)
        verify_agent_links(alternate_files | AGENT_INDEX_PATHS, pages)
    for path in sorted(alternate_files):
        jobs.append((path, "markdown", (DIST / path.lstrip("/")).read_bytes()))
    for path in sorted(downloads | {"/robots.txt"} | AGENT_INDEX_PATHS):
        jobs.append((path, "file", (DIST / path.lstrip("/")).read_bytes()))
    for path in sorted(assets):
        asset_path = urlsplit(path).path
        mime = ASSET_MIME_TYPES.get(Path(asset_path).suffix)
        require(mime is not None, f"no expected Content-Type for {path}")
        require((DIST / asset_path.lstrip("/")).is_file(), f"built HTML references missing asset {path}")
        jobs.append((path, "asset", mime))
    for index in sorted(DIST.glob("*/index.html")):
        path = "/" + index.parent.name
        if path not in path_set:
            jobs.append((path, "shell", None))
    config = json.loads((ROOT / "vercel.json").read_text())
    require(config.get("trailingSlash") is False, "the site must redirect trailing slashes to the canonical path")
    index_aliases = {path.rstrip("/") + "/index.html": path for path in candidates}
    jobs.extend((alias, "redirect", (308, path)) for alias, path in index_aliases.items())
    jobs.extend((path + "/", "redirect", (308, path)) for path in candidates if path != "/")
    site_request = "?request=site-selection&utm_source=release-check"
    jobs.append(("/contact/" + site_request, "redirect", (308, "/contact" + site_request)))
    for rule in config["redirects"]:
        source = rule["source"]
        if source in index_aliases or ":" in source:
            continue
        destination = rule["destination"]
        code = 308 if rule["permanent"] else 307
        jobs.append((source, "redirect", (code, destination)))
    not_found = Page("/404.html", (DIST / "404.html").read_bytes())
    require(path_set.isdisjoint(RETIRED), "retired content is still listed in the sitemap")
    jobs.extend((path, "missing", not_found) for path in MISSING + RETIRED)
    return jobs, len(candidates), len(assets)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("origin", help="Origin to check, for example https://invariant-ai.com")
    parser.add_argument("--full", action="store_true", help="Request every page in the built sitemap")
    parser.add_argument("--preserve-sitemap", type=Path, metavar="XML",
                        help="Require all URLs in a saved live sitemap to remain in the release")
    parser.add_argument("--preview", action="store_true", help="Allow a host-wide X-Robots-Tag noindex on preview HTML")
    parser.add_argument("--capture-indexnow-baseline", type=Path, metavar="JSON",
                        help="Snapshot the live canonical sitemap and page content before publishing")
    parser.add_argument("--indexnow-from", type=Path, metavar="JSON",
                        help="After full verification, list the changed URLs since a captured live baseline")
    parser.add_argument("--submit-indexnow", action="store_true",
                        help="Submit the verified changed URLs to IndexNow from the canonical origin")
    args = parser.parse_args()
    origin = args.origin.rstrip("/")
    url = urlsplit(origin)
    if url.scheme not in {"http", "https"} or not url.hostname or url.path or url.query or url.fragment or url.username:
        parser.error("origin must contain only the scheme, hostname, and optional port")
    if args.preview and url.hostname == urlsplit(CANONICAL).hostname:
        parser.error("run production verification without --preview")
    if args.submit_indexnow and (origin != CANONICAL or not args.indexnow_from):
        parser.error("--submit-indexnow requires the canonical origin and --indexnow-from")
    if args.capture_indexnow_baseline:
        if origin != CANONICAL or args.indexnow_from or args.full or args.preserve_sitemap:
            parser.error("capture the baseline by itself against the canonical origin")
        try:
            capture_indexnow_baseline(args.capture_indexnow_baseline)
        except (OSError, ValueError, KeyError, ElementTree.ParseError) as error:
            sys.exit(f"Cannot capture live IndexNow baseline: {error}")
        return 0
    full = args.full or bool(args.indexnow_from)
    try:
        sitemap = sitemap_entries((DIST / "sitemap.xml").read_bytes())
        expected_urls = set(sitemap)
        jobs, pages, assets = build_jobs(sitemap, full)
    except OSError as error:
        sys.exit(f"Cannot read the release from dist/. Run npm run build first. {error}")
    except (ValueError, KeyError, ElementTree.ParseError) as error:
        sys.exit(f"Invalid release in dist/: {error}")
    try:
        changed_urls = indexnow_changes(args.indexnow_from, jobs) if args.indexnow_from else []
    except (OSError, ValueError, KeyError, TypeError) as error:
        sys.exit(f"Cannot read IndexNow baseline: {error}")
    if args.preserve_sitemap:
        try:
            baseline = set(sitemap_entries(args.preserve_sitemap.read_bytes()))
        except (OSError, ValueError, ElementTree.ParseError) as error:
            sys.exit(f"Cannot read baseline sitemap {args.preserve_sitemap}: {error}")
        retired = baseline & {CANONICAL + path for path in RETIRED}
        missing = sorted(baseline - expected_urls - retired)
        if missing:
            sys.exit(f"Release omits {len(missing)} URLs from the baseline sitemap:\n" + "\n".join(missing))
        print(f"All {len(baseline - retired)} continuing sitemap URLs are present in dist/.")
        if retired:
            print(f"Expected HTTP 404 for {len(retired)} retired baseline URLs.")

    crawler_jobs = [(job, agent) for agent in CRAWLER_USER_AGENTS for job in jobs if job[0] in CRAWLER_SMOKE_PATHS]
    cases = [(job, None) for job in jobs] + crawler_jobs
    with ThreadPoolExecutor(max_workers=6) as pool:
        failures = [
            issue for issue in pool.map(lambda case: verify(origin, case[0], expected_urls, args.preview, case[1]), cases) if issue
        ]
    mode = "preview" if args.preview else "production rules"
    print(f"{origin} ({mode}): {len(cases) - len(failures)}/{len(cases)} HTTP checks passed, "
          f"covering {pages} sitemap pages, {assets} static assets and {len(crawler_jobs)} crawler User-Agent probes.")
    if failures:
        for issue in failures[:25]:
            print(issue, file=sys.stderr)
        if len(failures) > 25:
            print(f"… plus {len(failures) - 25} more failures.", file=sys.stderr)
        return 1
    if args.indexnow_from:
        print(f"IndexNow: {len(changed_urls)} changed or retired canonical URLs.", flush=True)
        for changed_url in changed_urls:
            print(changed_url, flush=True)
    if args.submit_indexnow and changed_urls:
        return run(["node", str(ROOT / "scripts/indexnow.mjs"), *changed_urls], check=False).returncode
    return 0


if __name__ == "__main__":
    sys.exit(main())
