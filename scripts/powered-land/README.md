# Powered land site pages

`python3 teaser.py ../../src/data/industry-articles/powered-land-sites.json` regenerates the
site-listing pages; `python3 covers.py ../..` regenerates their cover images. Then `npm run build`.

House rules: partial coverage only (region, approximate MW, acreage, timing, fit; no prices,
rates, towns, utilities or deal terms), US sites only, no em or en dashes.

Cover images are Gemini-generated, one distinct scene per page: add a prompt to
`cover_prompts.json`, then `GEMINI_API_KEY=... python3 gemini_covers.py ../.. <slug>`.
Do not run the old `covers.py` over them.
