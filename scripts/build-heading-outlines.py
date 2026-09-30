"""Recompose supplied DIN artwork for approved copy, without substituting fonts.
Requires fontTools (build-time only). Original assets stay untouched.
"""
import json, re, statistics, xml.etree.ElementTree as ET
from pathlib import Path
from collections import defaultdict
from fontTools.svgLib.path import parse_path
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root/'public/figma/type/manifest.json').read_text())
upper = {'6386','6479','6489','6501','6510','6562','6570','6538','6545','6818','6845','6620','6671','6675','6712'}
glyphs = {}; gaps = defaultdict(list); sources = set()
flat = set('BDEFHIKLMNPRTXYZfhiklmnrvwxz')
for entry in manifest:
    if entry['fontName'] != {'family':'DIN','style':'Medium'}: continue
    tree = ET.parse(root/('public'+entry['file']))
    path = next(tree.getroot().iter('{http://www.w3.org/2000/svg}path'))
    rec = RecordingPen(); parse_path(path.attrib['d'], rec)
    parts = []; current = []
    for op, pts in rec.value:
        current.append((op, pts))
        if op in ('closePath','endPath'):
            pen = BoundsPen(None)
            for method, args in current: getattr(pen, method)(*args)
            if pen.bounds: parts.append({'ops':current, 'box':pen.bounds})
            current = []
    chars = []
    for part in parts:
        x,y,r,b = part['box']
        match = next((g for g in reversed(chars[-2:]) if min(r,g['box'][2])-max(x,g['box'][0]) > .65*min(r-x,g['box'][2]-g['box'][0]) and abs((y+b)/2-(g['box'][1]+g['box'][3])/2)<entry['fontSize']),None)
        if match:
            a=match['box']; match['box']=(min(a[0],x),min(a[1],y),max(a[2],r),max(a[3],b)); match['ops']+=part['ops']
        else: chars.append(part)
    text=entry['text'].upper() if entry['id'].split(':')[1] in upper else entry['text']
    letters=[c for c in text if not c.isspace()]
    if len(letters)!=len(chars): raise ValueError(f"Outline count mismatch: {entry['id']}")
    size=entry['fontSize']
    baselines=[g['box'][3] for c,g in zip(letters,chars) if c in flat]
    for c,g in zip(letters,chars):
        if c not in glyphs:
            x,y,r,b=g['box']; baseline=min(baselines,key=lambda v:abs(v-b))
            glyphs[c]={'ops':g['ops'],'size':size,'left':x,'baseline':baseline,'width':(r-x)/size}
            sources.add(entry['file'])
    # Preserve observed pair spacing; estimate unseen pairs from the side bearings.
    gi=0
    for i,c in enumerate(text):
        if c.isspace():continue
        if i+1<len(text) and not text[i+1].isspace() and gi+1<len(chars):
            a,b=chars[gi]['box'],chars[gi+1]['box']
            gap=(b[0]-a[2])/size
            if -.2<gap<.3:gaps[c,text[i+1]].append(gap)
        gi+=1
pairs={k:statistics.median(v) for k,v in gaps.items()}
left=defaultdict(lambda:.04);right=defaultdict(lambda:.04)
for _ in range(80):
    for c in glyphs:
        ls=[gap-right[a] for (a,b),gap in pairs.items() if b==c]
        rs=[gap-left[b] for (a,b),gap in pairs.items() if a==c]
        if ls:left[c]=sum(ls)/len(ls)
        if rs:right[c]=sum(rs)/len(rs)

out=root/'public/figma/type/brand';out.mkdir(exist_ok=True)
headings={
 'solution-requirements':'Turn requirements',
 'solution-action':'into action.',
}
metadata={}
for name,text in headings.items():
    size=80 if name.startswith('hero') else 44
    height=size*(1.02 if name.startswith('hero') else 52/44)
    baseline=size*(.905 if name.startswith('hero') else 1.0)
    x=0;paths=[];combined=BoundsPen(None)
    for i,c in enumerate(text):
        if c==' ':x+=size*.24;continue
        g=glyphs[c];scale=size/g['size']
        transform=(scale,0,0,scale,x-g['left']*scale,baseline-g['baseline']*scale)
        pen=SVGPathPen(None); transformed=TransformPen(pen,transform); bounds=TransformPen(combined,transform)
        for method,args in g['ops']:
            getattr(transformed,method)(*args);getattr(bounds,method)(*args)
        paths.append(pen.getCommands());x+=g['width']*size
        if i+1<len(text) and text[i+1]!=' ':x+=size*pairs.get((c,text[i+1]),right[c]+left[text[i+1]])
    width=round(x+1,3)
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><path fill="#303030" d="'+''.join(paths)+'"/></svg>'
    (out/f'{name}.svg').write_text(svg)
    a,b,c,d=combined.bounds
    metadata[name]={'text':text,'width':width,'height':height,'fontSize':size,'bounds':{'x':round(a,3),'y':round(b,3),'width':round(c-a,3),'height':round(d-b,3)}}
(root/'src/components/brand-heading-lines.json').write_text(json.dumps(metadata,indent=2)+'\n')
print(json.dumps(metadata,indent=2))
