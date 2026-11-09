# Powered land site pages

`python3 teaser.py ../../src/data/industry-articles/powered-land-sites.json` regenerates the
site-listing pages; `python3 covers.py ../..` regenerates their cover images. Then `npm run build`.

House rules: partial coverage only (region, approximate MW, acreage, timing, fit; no prices,
rates, towns, utilities or deal terms), US sites only, no em or en dashes.
