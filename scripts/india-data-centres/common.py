"""Shared helpers for the India data centre cluster (scripts/india-data-centres/build.py).

House rules, same as the US cluster: every number carries a source, primary sources first
(PIB, ministries, regulators, state gazettes, company filings), no em or en dashes, no prices
or deal terms we cannot source, no site inventory (Invariant lists no Indian sites).
"""

DATE = '2026-11-21'
PILLAR = 'data-centres-in-india'
HUB_PATH = '/data-centre-compliance-india'


def p(text, *src):
    b = {'type': 'paragraph', 'text': text}
    if src:
        b['sourceIds'] = list(src)
    return b


def ul(items, *src):
    b = {'type': 'list', 'items': list(items)}
    if src:
        b['sourceIds'] = list(src)
    return b


def table(columns, rows, *src):
    b = {'type': 'table', 'columns': columns, 'rows': rows}
    if src:
        b['sourceIds'] = list(src)
    return b


def links(label, items):
    return {'type': 'links', 'label': label, 'items': [{'label': l, 'slug': s} for l, s in items]}


def sec(id, heading, *blocks):
    return {'id': id, 'heading': heading, 'blocks': list(blocks)}


def faq(q, a, *src):
    f = {'question': q, 'answer': a}
    if src:
        f['sourceIds'] = list(src)
    return f


# Every page in the India cluster: slug -> short link label. Cross-links may only point here
# (or at existing US pages listed in US_LINKS), and build-industry-content.mjs fails on a dead link.
PAGES = {
    # Pillar and site selection
    'data-centres-in-india': 'Data centres in India: capacity, cities, policy, power',
    'find-data-centre-site-india': 'How to find a data centre site in India',
    'data-centre-companies-india': 'Data centre companies in India',
    # Build and compliance
    'data-centre-approvals-india': 'Approvals for a data centre in India',
    'how-to-set-up-data-centre-india': 'How to set up a data centre in India',
    'data-centre-cost-per-mw-india': 'Data centre cost per MW in India',
    'data-centre-site-due-diligence-india': 'Site due diligence in India',
    'data-centre-land-india': 'Data centre land and powered land in India',
    'data-centre-seismic-flood-risk-india': 'Seismic zones, flood and cyclone risk',
    'data-centre-water-india': 'Water and groundwater NOC for data centres',
    'dpdp-data-localisation-data-centres-india': 'DPDP Act and data localisation',
    'data-centre-incentives-india-central': 'Infrastructure status, tax holiday and DC SEZs',
    # Policy
    'national-data-centre-policy-india': 'National data centre policy',
    'data-centre-policy-india-state-comparison': 'State data centre policies compared',
    'maharashtra-data-centre-policy': 'Maharashtra data centre policy',
    'uttar-pradesh-data-centre-policy': 'Uttar Pradesh data centre policy',
    'tamil-nadu-data-centre-policy': 'Tamil Nadu data centre policy',
    'telangana-data-centre-policy': 'Telangana data centre policy',
    'gujarat-data-centre-policy': 'Gujarat data centre policy',
    'karnataka-data-centre-policy': 'Karnataka data centre policy',
    'andhra-pradesh-data-centre-policy': 'Andhra Pradesh data centre policy',
    'haryana-data-centre-policy': 'Haryana data centre policy',
    'rajasthan-data-centre-policy': 'Rajasthan data centre policy',
    'odisha-data-centre-policy': 'Odisha data centre policy',
    'west-bengal-data-centre-policy': 'West Bengal data centre policy',
    'madhya-pradesh-data-centre-policy': 'Madhya Pradesh data centre policy',
    # Power
    'power-for-data-centres-india': 'Power for data centres in India',
    'data-centre-grid-connection-india': 'Grid connection: DISCOM, STU and CTU paths',
    'green-energy-open-access-data-centres-india': 'Green energy open access for data centres',
    'open-access-charges-by-state-india': 'Open access charges by state',
    'data-centre-power-demand-india': 'India data centre power demand to 2032',
    'power-study-data-centre-india': 'Power studies for Indian data centre sites',
    'data-centre-backup-power-dg-sets-india': 'Diesel generators and backup power rules',
    # Cities and markets
    'data-centres-in-mumbai': 'Data centres in Mumbai and Navi Mumbai',
    'data-centres-in-chennai': 'Data centres in Chennai',
    'data-centres-in-hyderabad': 'Data centres in Hyderabad',
    'data-centres-in-noida': 'Data centres in Noida and Delhi NCR',
    'data-centres-in-bengaluru': 'Data centres in Bengaluru',
    'data-centres-in-pune': 'Data centres in Pune',
    'data-centres-in-visakhapatnam': 'Data centres in Visakhapatnam',
    'data-centres-in-gujarat': 'Data centres in Gujarat: GIFT City, Ahmedabad, Jamnagar',
    'data-centres-in-kolkata': 'Data centres in Kolkata and East India',
    # Comparisons, AI, investment
    'mumbai-vs-chennai-vs-hyderabad-data-centres': 'Mumbai vs Chennai vs Hyderabad',
    'india-vs-singapore-vs-johor-data-centres': 'India vs Singapore vs Johor',
    'ai-data-centres-india': 'AI data centres and IndiaAI GPUs',
    'data-centre-investment-india': 'Data centre investment in India',
}

# Existing US pages the India pages may link to for the general method.
US_LINKS = {
    'utility-grade-power-study': 'Utility-grade power study (method)',
    'n-1-contingency-analysis-data-center': 'N-1 contingency analysis (method)',
    'data-center-substation-capacity-check': 'How to check substation capacity (method)',
    'data-center-land-acres-per-mw': 'Acres per MW (method)',
    'power-evidence-data-center-site-verification': 'Five rungs of power evidence',
    'gpu-cluster-power-requirements': 'How much power a GPU cluster needs',
    'find-data-center-site-us': 'Find a data center site in the US',
}

GROUPS = [
    ('Start here', ['data-centres-in-india', 'data-centre-compliance-hub', 'find-data-centre-site-india', 'data-centre-companies-india']),
    ('Build and approvals', ['data-centre-approvals-india', 'how-to-set-up-data-centre-india', 'data-centre-cost-per-mw-india', 'data-centre-site-due-diligence-india', 'data-centre-land-india', 'data-centre-seismic-flood-risk-india', 'data-centre-water-india', 'dpdp-data-localisation-data-centres-india', 'data-centre-incentives-india-central']),
    ('Power', ['power-for-data-centres-india', 'data-centre-grid-connection-india', 'green-energy-open-access-data-centres-india', 'open-access-charges-by-state-india', 'data-centre-power-demand-india', 'power-study-data-centre-india', 'data-centre-backup-power-dg-sets-india']),
    ('Policy by state', ['national-data-centre-policy-india', 'data-centre-policy-india-state-comparison', 'maharashtra-data-centre-policy', 'uttar-pradesh-data-centre-policy', 'tamil-nadu-data-centre-policy', 'telangana-data-centre-policy', 'gujarat-data-centre-policy', 'karnataka-data-centre-policy', 'andhra-pradesh-data-centre-policy', 'haryana-data-centre-policy', 'rajasthan-data-centre-policy', 'odisha-data-centre-policy', 'west-bengal-data-centre-policy', 'madhya-pradesh-data-centre-policy']),
    ('Cities', ['data-centres-in-mumbai', 'data-centres-in-chennai', 'data-centres-in-hyderabad', 'data-centres-in-noida', 'data-centres-in-bengaluru', 'data-centres-in-pune', 'data-centres-in-visakhapatnam', 'data-centres-in-gujarat', 'data-centres-in-kolkata']),
    ('Compare and invest', ['mumbai-vs-chennai-vs-hyderabad-data-centres', 'india-vs-singapore-vs-johor-data-centres', 'ai-data-centres-india', 'data-centre-investment-india']),
]


def cluster_links():
    """Crawlable links to every India page, grouped. Appended as the last section of every page.
    The hub is not a /blog page, so it is skipped here (the article rail links it on every page)."""
    return [links(label, [(PAGES[s], s) for s in slugs if s in PAGES]) for label, slugs in GROUPS]


def article(slug, title, description, region, intro, takeaways, sections, faqs, sources, related, minutes=7, service=None, howTo=None):
    assert slug in PAGES, slug
    for r in related:
        assert r in PAGES or r in US_LINKS, (slug, r)
    a = {
        'slug': slug, 'topic': 'Data Centers', 'kind': 'india-guide', 'region': region,
        'title': title, 'description': description, 'date': DATE, 'readMinutes': minutes,
        'intro': intro, 'takeaways': takeaways,
        'sections': sections + [sec('browse-india', 'More on data centres in India', *cluster_links())],
        'faqs': faqs, 'sources': sources, 'relatedSlugs': related,
    }
    if service:
        a['service'] = service
    if howTo:
        a['howTo'] = howTo
    return a


def src(id, title, url, publisher):
    return {'id': id, 'title': title, 'url': url, 'publisher': publisher}
