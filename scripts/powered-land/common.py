DATE = '2026-11-08'

SRC = {
    'eia-az': ('EIA Arizona electricity profile', 'https://www.eia.gov/electricity/state/arizona/', 'U.S. Energy Information Administration'),
    'eia-nc': ('EIA North Carolina electricity profile', 'https://www.eia.gov/electricity/state/northcarolina/', 'U.S. Energy Information Administration'),
    'eia-ok': ('EIA Oklahoma electricity profile', 'https://www.eia.gov/electricity/state/oklahoma/', 'U.S. Energy Information Administration'),
    'eia-ky': ('EIA Kentucky electricity profile', 'https://www.eia.gov/electricity/state/kentucky/', 'U.S. Energy Information Administration'),
    'eia-ia': ('EIA Iowa electricity profile', 'https://www.eia.gov/electricity/state/iowa/', 'U.S. Energy Information Administration'),
    'eia-tx': ('EIA Texas electricity profile', 'https://www.eia.gov/electricity/state/texas/', 'U.S. Energy Information Administration'),
    'eia-oh': ('EIA Ohio electricity profile', 'https://www.eia.gov/electricity/state/ohio/', 'U.S. Energy Information Administration'),
    'eia-nv': ('EIA Nevada electricity profile', 'https://www.eia.gov/electricity/state/nevada/', 'U.S. Energy Information Administration'),
    'eia-in': ('EIA Indiana electricity profile', 'https://www.eia.gov/electricity/state/indiana/', 'U.S. Energy Information Administration'),
    'eia-wi': ('EIA Wisconsin electricity profile', 'https://www.eia.gov/electricity/state/wisconsin/', 'U.S. Energy Information Administration'),
    'eia-ks': ('EIA Kansas electricity profile', 'https://www.eia.gov/electricity/state/kansas/', 'U.S. Energy Information Administration'),
    'eia-ny': ('EIA New York electricity profile', 'https://www.eia.gov/electricity/state/newyork/', 'U.S. Energy Information Administration'),
    'aps': ('Arizona Public Service', 'https://www.aps.com/', 'APS'),
    'oge': ('OG&E', 'https://www.oge.com/', 'OG&E'),
    'spp': ('Southwest Power Pool', 'https://www.spp.org/', 'SPP'),
    'miso': ('Midcontinent Independent System Operator', 'https://www.misoenergy.org/', 'MISO'),
    'pjm': ('PJM Interconnection', 'https://www.pjm.com/', 'PJM'),
    'ercot': ('Electric Reliability Council of Texas', 'https://www.ercot.com/', 'ERCOT'),
    'nyiso': ('New York Independent System Operator', 'https://www.nyiso.com/', 'NYISO'),
    'mpw': ('Muscatine Power and Water', 'https://mpw.org/', 'Muscatine Power and Water'),
    'centerpoint': ('CenterPoint Energy', 'https://www.centerpointenergy.com/', 'CenterPoint Energy'),
    'ku': ('LG&E and KU Energy', 'https://lge-ku.com/', 'LG&E and KU'),
    'kypower': ('Kentucky Power', 'https://www.kentuckypower.com/', 'AEP Kentucky Power'),
    'im': ('Indiana Michigan Power', 'https://www.indianamichiganpower.com/', 'AEP Indiana Michigan Power'),
    'nvenergy': ('NV Energy', 'https://www.nvenergy.com/', 'NV Energy'),
    'oz': ('Opportunity Zones', 'https://www.irs.gov/credits-deductions/businesses/opportunity-zones', 'Internal Revenue Service'),
    'ec': ('Energy Communities', 'https://energycommunities.gov/', 'Interagency Working Group on Coal and Power Plant Communities'),
    'fingrid': ('Fingrid', 'https://www.fingrid.fi/en/', 'Fingrid'),
    'ferc-ll': ('FERC', 'https://www.ferc.gov/', 'Federal Energy Regulatory Commission'),
}


def sources(*ids):
    return [{'id': i, 'title': SRC[i][0], 'url': SRC[i][1], 'publisher': SRC[i][2]} for i in ids]


def p(text, *src):
    b = {'type': 'paragraph', 'text': text}
    if src:
        b['sourceIds'] = list(src)
    return b


def ul(*items):
    return {'type': 'list', 'items': list(items)}


def table(columns, rows, *src):
    b = {'type': 'table', 'columns': columns, 'rows': rows}
    if src:
        b['sourceIds'] = list(src)
    return b


def sec(id, heading, *blocks):
    return {'id': id, 'heading': heading, 'blocks': list(blocks)}


def faq(q, a, *src):
    f = {'question': q, 'answer': a}
    if src:
        f['sourceIds'] = list(src)
    return f


VERIFY_HEADING = 'What we check before an introduction'


def article(slug, title, description, region, intro, takeaways, sections, faqs, srcs, related, minutes=6):
    return {
        'slug': slug, 'topic': 'Data Centers', 'kind': 'site-listing', 'region': region,
        'title': title, 'description': description, 'date': DATE, 'readMinutes': minutes,
        'intro': intro, 'takeaways': takeaways, 'sections': sections, 'faqs': faqs,
        'sources': srcs, 'relatedSlugs': related,
    }
