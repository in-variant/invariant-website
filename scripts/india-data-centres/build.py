"""Generate the India data centre cluster.

Run from this folder:  python3 build.py ../../src/data/industry-articles/india-data-centres.json
Then `npm run build` (validates every slug, source id and link again, prerenders, writes sitemap,
llms.txt, llms-full.txt and the .md copies).

Each pages_*.py module exports ARTICLES, a list built with common.article(). Sources live next to
the text that cites them. House rules are in common.py.
"""
import importlib, json, re, sys
from common import PAGES, US_LINKS

MODULES = ['pages_core', 'pages_build', 'pages_power', 'pages_policy', 'pages_cities', 'pages_markets']
DASHES = ('—', '–')


def validate(a):
    errs = []
    blob = json.dumps(a, ensure_ascii=False)
    for d in DASHES:
        if d in blob:
            errs.append('em or en dash')
    if '§' in blob:
        errs.append('section sign')
    ids = [s['id'] for s in a['sources']]
    if len(ids) != len(set(ids)):
        errs.append('duplicate source id')
    for s in a['sources']:
        if not s['url'].startswith('https://'):
            errs.append('non-https source ' + s['url'])
    used = set()
    for sec in a['sections']:
        for b in sec['blocks']:
            used.update(b.get('sourceIds', []))
            if b['type'] == 'table':
                for r in b['rows']:
                    if len(r) != len(b['columns']):
                        errs.append('uneven table in ' + sec['id'])
            if b['type'] == 'links':
                for i in b['items']:
                    if i['slug'] not in PAGES and i['slug'] not in US_LINKS:
                        errs.append('dead link ' + i['slug'])
    for f in a['faqs']:
        used.update(f.get('sourceIds', []))
    missing = used - set(ids)
    if missing:
        errs.append('unknown source ids %s' % sorted(missing))
    unused = set(ids) - used
    if unused:
        errs.append('sources never cited %s' % sorted(unused))
    if len(a['sections']) != len({s['id'] for s in a['sections']}):
        errs.append('duplicate section id')
    if not (50 <= len(a['description']) <= 230):
        errs.append('description length %d' % len(a['description']))
    if len(a['faqs']) < 4:
        errs.append('fewer than 4 FAQs')
    if re.search(r'\bTODO\b|UNVERIFIED|\?\?', blob):
        errs.append('placeholder text')
    return errs


def main(out):
    articles, problems = [], []
    for m in MODULES:
        try:
            mod = importlib.import_module(m)
        except ModuleNotFoundError:
            print('skip (not written yet):', m)
            continue
        for a in mod.ARTICLES:
            e = validate(a)
            if e:
                problems.append((a['slug'], e))
            articles.append(a)
    slugs = [a['slug'] for a in articles]
    dup = {s for s in slugs if slugs.count(s) > 1}
    if dup:
        problems.append(('cluster', ['duplicate slugs %s' % sorted(dup)]))
    for slug, e in problems:
        print('FAIL', slug, '; '.join(e))
    if problems:
        sys.exit(1)
    written = set(slugs)
    # Drop links to pages that are not written yet, so a partial run still builds.
    for a in articles:
        for sec in a['sections']:
            for b in sec['blocks']:
                if b['type'] == 'links':
                    b['items'] = [i for i in b['items'] if i['slug'] in written or i['slug'] in US_LINKS]
            sec['blocks'] = [b for b in sec['blocks'] if b['type'] != 'links' or b['items']]
        a['relatedSlugs'] = [s for s in a['relatedSlugs'] if s in written or s in US_LINKS]
    json.dump(articles, open(out, 'w'), ensure_ascii=False, indent=2)
    open(out, 'a').write('\n')
    missing = [s for s in PAGES if s not in written]
    print('wrote %d India pages; not yet written: %s' % (len(articles), missing or 'none'))


if __name__ == '__main__':
    main(sys.argv[1])
