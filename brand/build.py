#!/usr/bin/env python3
import base64, os, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
def b64(p):
    with open(p, 'rb') as f:
        return base64.b64encode(f.read()).decode()

SG = b64(os.path.expanduser('~/Library/Fonts/SpaceGrotesk.ttf'))
IN = b64(os.path.join(ROOT, 'inter.ttf'))
WHITE = '#ECEAE7'

def img_b64(p):
    return b64(os.path.join(ROOT, p))

# letter-spacing px, opacity via fill-opacity
def T(x, y, font, size, weight, text, ls=0, op=1.0, anchor='start'):
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{font}" font-weight="{weight}" '
            f'font-size="{size}" letter-spacing="{ls}" fill="{WHITE}" '
            f'fill-opacity="{op}">{text}</text>')

def build(cfg, out):
    im = cfg['img']
    extra_defs = ''
    overlay = ''
    if cfg.get('scrim'):
        stops = ''.join(f'<stop offset="{o}" stop-color="{c}" stop-opacity="{a}"/>'
                        for (o, c, a) in cfg['scrim'])
        extra_defs += f'<linearGradient id="scr" x1="0" y1="0" x2="1" y2="0">{stops}</linearGradient>'
        overlay += '<rect width="1080" height="1350" fill="url(#scr)"/>'
    if cfg.get('radial'):
        r = cfg['radial']
        stops = ''.join(f'<stop offset="{o}" stop-color="{r["color"]}" stop-opacity="{a}"/>'
                        for (o, a) in r['stops'])
        extra_defs += (f'<radialGradient id="rad" gradientUnits="userSpaceOnUse" '
                       f'cx="{r["cx"]}" cy="{r["cy"]}" r="{r["r"]}">{stops}</radialGradient>')
        overlay += '<rect width="1080" height="1350" fill="url(#rad)"/>'
    texts = '\n  '.join(T(**t) for t in cfg['texts'])
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1080 1350">
  <defs><style>
    @font-face{{font-family:'SG';src:url(data:font/ttf;base64,{SG}) format('truetype');font-weight:300 700;}}
    @font-face{{font-family:'IN';src:url(data:font/ttf;base64,{IN}) format('truetype');font-weight:100 900;}}
  </style>{extra_defs}</defs>
  <image x="{im['x']}" y="{im['y']}" width="{im['w']}" height="{im['h']}" preserveAspectRatio="{im['par']}" xlink:href="data:image/png;base64,{img_b64(cfg['src'])}"/>
  {overlay}
  {texts}
</svg>'''
    svgp = os.path.join(ROOT, 'tmp.svg')
    with open(svgp, 'w') as f:
        f.write(svg)
    subprocess.run(['qlmanage', '-t', '-s', '1350', '-o', ROOT, svgp],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    png = svgp + '.png'
    subprocess.run(['sips', '-c', '1350', '1080', png, '--out', os.path.join(ROOT, out)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(svgp); os.remove(png)
    print('built', out)

FULL = {'x':0,'y':0,'w':1080,'h':1350,'par':'xMidYMid slice'}
# slide 2 source is 1003x1568 -> place to keep top (logo) and most sky
S2 = {'x':0,'y':-43,'w':1080,'h':1688,'par':'none'}
LSCRIM = [(0,'#0E1626',0.55),(0.5,'#0E1626',0.12),(0.72,'#0E1626',0.0)]
LSCRIM_S = [(0,'#0E1626',0.62),(0.55,'#0E1626',0.16),(0.78,'#0E1626',0.0)]

SLIDES = [
 # 1 — cover (centered over the photo, big)
 {'src':'deck/src01.png','img':FULL,
  'radial':{'cx':540,'cy':630,'r':780,'color':'#0E1626','stops':[(0,0.62),(0.5,0.36),(1,0.05)]},
  'texts':[
   dict(x=540,y=470,anchor='middle',font='IN',size=25,weight=600,ls=4,op=0.78,text='THE BIGGEST IPO IN AEROSPACE HISTORY'),
   dict(x=540,y=600,anchor='middle',font='SG',size=88,weight=600,ls=-2.5,text='SpaceX&#8217;s biggest'),
   dict(x=540,y=694,anchor='middle',font='SG',size=88,weight=600,ls=-2.5,text='risk isn&#8217;t a rocket.'),
   dict(x=540,y=770,anchor='middle',font='IN',size=30,weight=400,op=0.85,text='One word appears 150 times in its S-1.'),
 ]},
 # 2 — regulatory
 {'src':'deck/src02.png','img':S2,'scrim':LSCRIM,'texts':[
   dict(x=84,y=540,font='SG',size=70,weight=600,ls=-1.5,text='Not &#8220;technical.&#8221;'),
   dict(x=84,y=626,font='SG',size=70,weight=600,ls=-1.5,text='Not &#8220;engineering.&#8221;'),
   dict(x=84,y=712,font='SG',size=70,weight=600,ls=-1.5,text='Not &#8220;competition.&#8221;'),
   dict(x=84,y=798,font='SG',size=70,weight=600,ls=-1.5,text='Regulatory.'),
   dict(x=86,y=902,font='IN',size=30,weight=400,op=0.8,text='What a company tells the public market, under'),
   dict(x=86,y=944,font='IN',size=30,weight=400,op=0.8,text='oath, about what actually keeps it up at night.'),
 ]},
 # 3 — TAM
 {'src':'deck/src03.png','img':FULL,'scrim':LSCRIM_S,'texts':[
   dict(x=86,y=472,font='IN',size=24,weight=600,ls=4,op=0.7,text='TOTAL ADDRESSABLE MARKET'),
   dict(x=82,y=580,font='SG',size=92,weight=600,ls=-3,text='$28.5 trillion.'),
   dict(x=86,y=678,font='IN',size=29,weight=400,op=0.82,text='The largest addressable market in human history.'),
   dict(x=86,y=718,font='IN',size=29,weight=400,op=0.82,text='Every part of it gated by regulatory compliance.'),
 ]},
 # 4 — FAA
 {'src':'deck/src04.png','img':FULL,'scrim':LSCRIM,'texts':[
   dict(x=84,y=440,font='SG',size=54,weight=600,ls=-1.2,text='&#8220;We depend on timely'),
   dict(x=84,y=508,font='SG',size=54,weight=600,ls=-1.2,text='approvals from the FAA.&#8221;'),
   dict(x=86,y=610,font='IN',size=28,weight=400,op=0.82,text='Pads ready. Fuel loaded. Engineers done.'),
   dict(x=86,y=648,font='IN',size=28,weight=400,op=0.82,text='Still grounded, because an agency has not'),
   dict(x=86,y=686,font='IN',size=28,weight=400,op=0.82,text='finished the paperwork.'),
 ]},
 # 5 — Starship cannot land itself
 {'src':'deck/src05.png','img':FULL,'scrim':LSCRIM_S,'texts':[
   dict(x=84,y=436,font='SG',size=62,weight=600,ls=-1.5,text='Starship can&#8217;t'),
   dict(x=84,y=508,font='SG',size=62,weight=600,ls=-1.5,text='land itself.'),
   dict(x=84,y=580,font='SG',size=62,weight=600,ls=-1.5,text='Legally.'),
   dict(x=86,y=678,font='IN',size=26,weight=400,op=0.82,text='It has already caught a booster'),
   dict(x=86,y=712,font='IN',size=26,weight=400,op=0.82,text='on robotic arms. The maneuver'),
   dict(x=86,y=746,font='IN',size=26,weight=400,op=0.82,text='works. The FAA waiver to do it'),
   dict(x=86,y=780,font='IN',size=26,weight=400,op=0.82,text='does not exist yet.'),
 ]},
 # 6 — cadence
 {'src':'deck/src06.png','img':FULL,'scrim':LSCRIM,'texts':[
   dict(x=84,y=362,font='SG',size=56,weight=600,ls=-1.4,text='Growth runs on cadence.'),
   dict(x=84,y=432,font='SG',size=56,weight=600,ls=-1.4,text='Cadence runs on the FAA.'),
   dict(x=86,y=534,font='IN',size=28,weight=400,op=0.82,text='Every increase in launch rate depends'),
   dict(x=86,y=572,font='IN',size=28,weight=400,op=0.82,text='on the FAA keeping pace.'),
 ]},
 # 7 — anomalies
 {'src':'deck/src07.png','img':FULL,'scrim':LSCRIM,'texts':[
   dict(x=84,y=360,font='SG',size=54,weight=600,ls=-1.3,text='&#8220;Managing tolerance'),
   dict(x=84,y=428,font='SG',size=54,weight=600,ls=-1.3,text='for anomalies.&#8221;'),
   dict(x=86,y=528,font='IN',size=28,weight=400,op=0.82,text='Not preventing failures. Managing the'),
   dict(x=86,y=566,font='IN',size=28,weight=400,op=0.82,text='regulator&#8217;s response, which SpaceX'),
   dict(x=86,y=604,font='IN',size=28,weight=400,op=0.82,text='lists as a material risk.'),
 ]},
 # 8 — spectrum / Starlink
 {'src':'deck/src08.png','img':FULL,'scrim':LSCRIM_S,'texts':[
   dict(x=84,y=556,font='SG',size=56,weight=600,ls=-1.4,text='Launch is half'),
   dict(x=84,y=626,font='SG',size=56,weight=600,ls=-1.4,text='the company.'),
   dict(x=86,y=726,font='IN',size=28,weight=400,op=0.82,text='Starlink is the other half, and just'),
   dict(x=86,y=764,font='IN',size=28,weight=400,op=0.82,text='as exposed: some regulators may'),
   dict(x=86,y=802,font='IN',size=28,weight=400,op=0.82,text='never grant approval at all.'),
 ]},
 # 9 — conclusion
 {'src':'deck/src09.png','img':FULL,'scrim':LSCRIM,'texts':[
   dict(x=84,y=360,font='SG',size=58,weight=600,ls=-1.4,text='The bottleneck isn&#8217;t'),
   dict(x=84,y=432,font='SG',size=58,weight=600,ls=-1.4,text='propulsion.'),
   dict(x=86,y=534,font='IN',size=30,weight=400,op=0.85,text='It&#8217;s the compliance surface.'),
   dict(x=86,y=576,font='IN',size=30,weight=400,op=0.85,text='And it&#8217;s enormous.'),
 ]},
 # 10 — outro (centered, big, like the cover)
 {'src':'deck/src10.png','img':FULL,
  'radial':{'cx':540,'cy':650,'r':800,'color':'#0E1626','stops':[(0,0.6),(0.5,0.34),(1,0.06)]},
  'texts':[
   dict(x=540,y=600,anchor='middle',font='SG',size=94,weight=600,ls=-2.5,text='This is what'),
   dict(x=540,y=694,anchor='middle',font='SG',size=94,weight=600,ls=-2.5,text='we handle.'),
   dict(x=540,y=766,anchor='middle',font='IN',size=30,weight=400,op=0.85,text='Invariant builds AI-native compliance'),
   dict(x=540,y=804,anchor='middle',font='IN',size=30,weight=400,op=0.85,text='for nuclear, space, and aerospace.'),
   dict(x=540,y=872,anchor='middle',font='IN',size=19,weight=400,op=0.5,text='Independent reading of SpaceX&#8217;s public S-1. Not affiliated with SpaceX.'),
 ]},
]

sel = sys.argv[1:] or [str(i) for i in range(1, len(SLIDES)+1)]
for i in sel:
    n = int(i)
    build(SLIDES[n-1], f'final{n:02d}.png')
