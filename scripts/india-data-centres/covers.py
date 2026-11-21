"""Cover images for the India cluster (1600x900 webp in public/blog/industry/), in the navy grid style
of scripts/powered-land/covers.py. Text only from the page registry, so no figure can drift from the page.

Run from this folder:  python3 covers.py ../..
To replace any of these with a photographic cover later, add a prompt for the slug to
scripts/powered-land/cover_prompts.json and run gemini_covers.py for that slug.
"""
import sys
from PIL import Image, ImageDraw, ImageFont
from common import PAGES

R = sys.argv[1]
FONT = R + '/brand/inter.ttf'
W, H = 1600, 900

BIG = {  # short headline per page; falls back to the registry label
    'data-centres-in-india': 'India', 'find-data-centre-site-india': 'Site selection',
    'data-centre-companies-india': 'Operators', 'data-centre-approvals-india': 'Approvals',
    'how-to-set-up-data-centre-india': 'How to build', 'data-centre-cost-per-mw-india': 'Cost per MW',
    'data-centre-site-due-diligence-india': 'Due diligence', 'data-centre-land-india': 'Land',
    'data-centre-seismic-flood-risk-india': 'Seismic and flood', 'data-centre-water-india': 'Water',
    'dpdp-data-localisation-data-centres-india': 'DPDP and data', 'data-centre-incentives-india-central': 'Incentives',
    'national-data-centre-policy-india': 'National policy', 'data-centre-policy-india-state-comparison': 'State policies',
    'maharashtra-data-centre-policy': 'Maharashtra', 'uttar-pradesh-data-centre-policy': 'Uttar Pradesh',
    'tamil-nadu-data-centre-policy': 'Tamil Nadu', 'telangana-data-centre-policy': 'Telangana',
    'gujarat-data-centre-policy': 'Gujarat', 'karnataka-data-centre-policy': 'Karnataka',
    'andhra-pradesh-data-centre-policy': 'Andhra Pradesh', 'haryana-data-centre-policy': 'Haryana',
    'rajasthan-data-centre-policy': 'Rajasthan', 'odisha-data-centre-policy': 'Odisha',
    'west-bengal-data-centre-policy': 'West Bengal', 'madhya-pradesh-data-centre-policy': 'Madhya Pradesh',
    'power-for-data-centres-india': 'Power', 'data-centre-grid-connection-india': 'Grid connection',
    'green-energy-open-access-data-centres-india': 'Green open access', 'open-access-charges-by-state-india': 'Open access charges',
    'data-centre-power-demand-india': 'Power demand', 'power-study-data-centre-india': 'Power studies',
    'data-centre-backup-power-dg-sets-india': 'Backup power', 'data-centres-in-mumbai': 'Mumbai',
    'data-centres-in-chennai': 'Chennai', 'data-centres-in-hyderabad': 'Hyderabad', 'data-centres-in-noida': 'Noida and NCR',
    'data-centres-in-bengaluru': 'Bengaluru', 'data-centres-in-pune': 'Pune', 'data-centres-in-visakhapatnam': 'Visakhapatnam',
    'data-centres-in-gujarat': 'Gujarat', 'data-centres-in-kolkata': 'Kolkata',
    'mumbai-vs-chennai-vs-hyderabad-data-centres': 'Three cities', 'india-vs-singapore-vs-johor-data-centres': 'India vs SG vs Johor',
    'ai-data-centres-india': 'AI and GPUs', 'data-centre-investment-india': 'Investment',
}
EYEBROW = {s: ('DATA CENTRE POLICY, INDIA' if s.endswith('-policy') or 'policy' in s
               else 'DATA CENTRES, INDIA') for s in PAGES}


def cover(slug, big, sub, eyebrow, out):
    im = Image.new('RGB', (W, H), (11, 21, 51)); d = ImageDraw.Draw(im)
    for x in range(0, W, 80): d.line([(x, 0), (x, H)], fill=(20, 36, 82))
    for y in range(0, H, 80): d.line([(0, y), (W, y)], fill=(20, 36, 82))
    d.line([(0, 700), (W, 610)], fill=(2, 47, 219), width=6)
    d.line([(0, 740), (W, 650)], fill=(2, 47, 219), width=3)
    for cx in (1020, 1260, 1500):
        y = 700 - cx * 90 / W
        d.polygon([(cx - 40, y + 170), (cx, y - 60), (cx + 40, y + 170)], outline=(80, 110, 230), width=4)
    size = 200; f1 = ImageFont.truetype(FONT, size)
    while d.textlength(big, font=f1) > W - 200: size -= 8; f1 = ImageFont.truetype(FONT, size)
    f2 = ImageFont.truetype(FONT, 48); f3 = ImageFont.truetype(FONT, 30)
    while d.textlength(sub, font=f2) > W - 200 and f2.size > 30: f2 = ImageFont.truetype(FONT, f2.size - 2)
    d.text((100, 140), eyebrow, font=f3, fill=(251, 77, 3))
    d.text((92, 200), big, font=f1, fill=(255, 255, 255))
    d.text((100, 200 + size + 40), sub, font=f2, fill=(200, 212, 255))
    d.text((100, H - 90), 'INVARIANT  /  invariant-ai.com', font=f3, fill=(200, 212, 255))
    im.save(out, 'WEBP', quality=82)


for slug, label in PAGES.items():
    cover(slug, BIG.get(slug, label), label, EYEBROW[slug], f'{R}/public/blog/industry/{slug}.webp')
cover('data-centre-compliance-india', 'Approvals', 'Every approval behind a data centre in India', 'DATA CENTRE COMPLIANCE, INDIA',
      f'{R}/public/blog/industry/data-centre-compliance-india.webp')
print('covers:', len(PAGES) + 1)
