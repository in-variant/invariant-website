"""Generate a distinct Gemini cover image per powered-land page. Key from GEMINI_API_KEY env."""
import base64, io, json, os, sys, urllib.request, concurrent.futures as cf
from PIL import Image
MODEL = os.environ.get('GEMINI_IMAGE_MODEL', 'gemini-3-pro-image')
KEY = os.environ['GEMINI_API_KEY']
ROOT = sys.argv[1]
PROMPTS = json.load(open(os.path.join(os.path.dirname(__file__), 'cover_prompts.json')))
STYLE = (' Photorealistic editorial photograph, wide 16:9 landscape composition, natural light, '
         'high detail, muted professional color grade. No text, no words, no letters, no logos, no watermarks, no people in the foreground.')

def gen(slug):
    out = f'{ROOT}/public/blog/industry/{slug}.webp'
    if os.path.exists(out + '.gemini') and '--force' not in sys.argv: return slug, 'skip'
    body = {'contents': [{'parts': [{'text': PROMPTS[slug] + STYLE}]}],
            'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '16:9'}}}
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
        data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    for attempt in range(3):
        try:
            d = json.load(urllib.request.urlopen(req, timeout=180))
            part = next(p for p in d['candidates'][0]['content']['parts'] if 'inlineData' in p)
            im = Image.open(io.BytesIO(base64.b64decode(part['inlineData']['data']))).convert('RGB')
            w, h = im.size; th = int(w * 9 / 16)
            if th <= h: im = im.crop((0, (h - th) // 2, w, (h - th) // 2 + th))
            im.resize((1600, 900), Image.LANCZOS).save(out, 'WEBP', quality=82)
            open(out + '.gemini', 'w').write(MODEL)
            return slug, 'ok'
        except Exception as e:
            err = str(e)[:120]
    return slug, 'FAIL ' + err

slugs = [a for a in sys.argv[2:] if not a.startswith('--')] or list(PROMPTS)
with cf.ThreadPoolExecutor(4) as ex:
    for slug, st in ex.map(gen, slugs): print(st, slug, flush=True)
