import json, sys
from PIL import Image, ImageDraw, ImageFont
R = sys.argv[1]
arts = json.load(open(R + '/src/data/industry-articles/powered-land-sites.json'))
font = R + '/brand/inter.ttf'
STAT = {
 'powered-land-for-sale-data-center-sites': ('35 US SITES', 'Powered land available now'),
 'arizona-1-5-gw-powered-land-ai-campus': ('1.5 GW', 'Arizona AI campus'),
 'north-carolina-18-mw-ai-campus-207-acres-for-sale': ('18 MW LIVE', 'North Carolina AI campus'),
 'oklahoma-city-55-mw-powered-brownfield-84-acres-oge': ('55 MW', 'Oklahoma City brownfield'),
 'oklahoma-5-mw-turnkey-mining-site-for-sale': ('5 MW', 'Two Oklahoma turnkey sites'),
 'kentucky-turnkey-bitcoin-mining-sites-for-sale': ('0.5 TO 8 MW', 'Seven Kentucky sites'),
 'iowa-2-mw-ai-edge-site-at-a-power-plant': ('2 MW+', 'Iowa AI edge site'),
 'houston-texas-3-mw-ercot-mining-site-for-sale': ('3 MW', 'Houston, ERCOT'),
 'ohio-300-mw-powered-land-345-kv-data-center-site': ('300 MW', 'Ohio, 345 kV'),
 'nevada-375-mw-powered-land-230-kv-data-center-site': ('375 MW', 'Nevada, 350 acres'),
 'indianapolis-200-mw-greenfield-data-center-site': ('200 MW', 'Indianapolis greenfield'),
 'kentucky-30-mw-greenfield-data-center-site': ('30 MW', 'Kentucky greenfield'),
 'wisconsin-150-mw-data-center-mining-site-for-sale': ('150 MW', 'Wisconsin, 130 acres'),
 'texas-44-mw-data-center-property-250-mw-expansion': ('44 MW', 'Texas metro property'),
 'kansas-250-mw-behind-the-meter-gas-power-site': ('250 MW', 'Kansas gas + land'),
 'finland-20-mw-data-center-site-heat-offtake-for-sale': ('20 MW', 'Finland, heat offtake'),
 'bolivia-300-mw-greenfield-mining-site': ('300 MW', 'Bolivia greenfield'),
 'caucasus-hydro-power-mining-site-for-sale': ('20 TO 60 MW', 'Caucasus hydro site'),
 'north-dakota-mining-power-off-grid-and-managed-containers': ('15 MW', 'North Dakota off-grid'),
 'norway-hydro-mining-sites-for-sale': ('HYDRO', 'Norway mining sites'),
 'bitcoin-mining-hosting-capacity-us': ('11 SITES', 'US mining hosting'),
 'texas-17-mw-greenfield-mining-site-houston-load-zone': ('17 MW', 'Texas greenfield, Houston zone'),
 'oregon-10-mw-hydro-mining-site-expandable-100-mw': ('10 MW', 'Oregon hydro, to 100 MW+'),
 'iowa-20-to-500-mw-mining-site-long-term-ppa': ('500 MW', 'Iowa PPA site'),
 'iowa-2-mw-turnkey-mining-site-scalable-7-mw': ('2 MW', 'Iowa turnkey, to 7 MW'),
 'pennsylvania-5-mw-turnkey-mining-site-for-sale': ('5 MW', 'Pennsylvania turnkey'),
 'pennsylvania-500-mw-gas-and-grid-data-center-site': ('500 MW', 'Pennsylvania gas + grid'),
 'midwest-85-mw-brownfield-mining-site': ('85 MW', 'Midwest brownfield'),
 'turnkey-tier-iii-data-centers-for-sale-and-lease': ('TIER III', 'Turnkey data centers'),
 'earlier-powered-site-and-hosting-listings': ('2023 TO 2025', 'Earlier site listings'),
 'new-york-60-mw-gas-peaker-plant-nyiso-zone-e-for-sale': ('60 MW', 'New York peaker plant'),
}
W,H=1600,900
for a in arts:
    big, sub = STAT[a['slug']]
    im = Image.new('RGB',(W,H),(11,21,51)); d = ImageDraw.Draw(im)
    for x in range(0,W,80): d.line([(x,0),(x,H)], fill=(20,36,82))
    for y in range(0,H,80): d.line([(0,y),(W,y)], fill=(20,36,82))
    # transmission motif
    d.line([(0,700),(W,610)], fill=(2,47,219), width=6)
    d.line([(0,740),(W,650)], fill=(2,47,219), width=3)
    for cx in (1020, 1260, 1500):
        y = 700 - cx*90/W
        d.polygon([(cx-40,y+170),(cx,y-60),(cx+40,y+170)], outline=(80,110,230), width=4)
    f1 = ImageFont.truetype(font, 220); f2 = ImageFont.truetype(font, 56); f3 = ImageFont.truetype(font, 30)
    size = 220
    while d.textlength(big, font=f1) > W-200: size -= 10; f1 = ImageFont.truetype(font, size)
    d.text((100,140), 'POWERED SITE AVAILABLE', font=f3, fill=(251,77,3))
    d.text((92,200), big, font=f1, fill=(255,255,255))
    d.text((100,200+size+30), sub, font=f2, fill=(200,212,255))
    d.text((100,H-90), 'INVARIANT  /  BOOK A CALL  /  (628) 220-8972', font=f3, fill=(200,212,255))
    im.save(f"{R}/public/blog/industry/{a['slug']}.webp", 'WEBP', quality=82)
print('ok', len(arts))
