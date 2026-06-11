#!/usr/bin/env bash
# Generate per-entry OG images for every glossary entry.
# Reads slug + term from src/pages/_data/glossary.json, writes PNGs to public/og/glossary/{slug}.png.
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p public/og/glossary
TMP="$(mktemp -d)"

python3 - <<'PY' > "$TMP/manifest.tsv"
import json
d = json.load(open("src/pages/_data/glossary.json"))
for e in d.get("entries", []):
    slug = e["slug"]
    term = e["term"]
    topic = e["topic"]
    # rough char-budget: keep within 1040 wide @ 72px font
    # split term into lines if it's long
    print(f"{slug}\t{term}\t{topic}")
PY

while IFS=$'\t' read -r slug term topic; do
  TOPIC_LABEL=$(echo "$topic" | tr '[:lower:]' '[:upper:]')
  # Pick eyebrow text by topic
  case "$topic" in
    space) EYEBROW="INVARIANT · SPACE GLOSSARY" ;;
    nuclear) EYEBROW="INVARIANT · NUCLEAR GLOSSARY" ;;
    aerospace) EYEBROW="INVARIANT · AEROSPACE GLOSSARY" ;;
    *) EYEBROW="INVARIANT · GLOSSARY" ;;
  esac

  # Wrap term to 2 lines if longer than ~26 chars
  if [ ${#term} -gt 26 ]; then
    # Split on space at midpoint
    MIDPOINT=$(( ${#term} / 2 ))
    LINE1="${term:0:MIDPOINT}"
    LINE2="${term:MIDPOINT}"
    # Adjust to nearest space
    SPACE_POS=$(echo "$term" | awk -v mid=$MIDPOINT 'BEGIN{best=0} {for(i=1;i<=length($0);i++) if (substr($0,i,1)==" " && (best==0 || (i-mid)*(i-mid) < (best-mid)*(best-mid))) best=i} END{print best}')
    if [ "$SPACE_POS" -gt 0 ]; then
      LINE1="${term:0:SPACE_POS-1}"
      LINE2="${term:SPACE_POS}"
    fi
  else
    LINE1="$term"
    LINE2=""
  fi

  cat > "$TMP/$slug.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FAFAF7"/>
      <stop offset="100%" stop-color="#ECEAE7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#1B2436" stroke-opacity="0.15" stroke-width="1"/>
  <text x="80" y="135" font-family="IBM Plex Mono, Menlo, monospace" font-size="14" letter-spacing="2.2" fill="#C57A3E">$EYEBROW</text>
  <text x="80" y="310" font-family="Newsreader, Georgia, serif" font-size="92" font-weight="400" fill="#1B2436" letter-spacing="-1.8">$LINE1</text>
SVG
  if [ -n "$LINE2" ]; then
    cat >> "$TMP/$slug.svg" <<SVG
  <text x="80" y="410" font-family="Newsreader, Georgia, serif" font-size="92" font-weight="400" fill="#1B2436" letter-spacing="-1.8">$LINE2</text>
SVG
  fi
  cat >> "$TMP/$slug.svg" <<SVG
  <text x="80" y="510" font-family="Newsreader, Georgia, serif" font-size="36" font-weight="400" fill="#1B2436" fill-opacity="0.55" font-style="italic" letter-spacing="-0.6">Defined for builders.</text>
  <text x="80" y="555" font-family="Satoshi, system-ui, sans-serif" font-size="22" fill="#1B2436" fill-opacity="0.55">invariant-ai.com/glossary/$slug</text>
  <line x1="80" y1="585" x2="1120" y2="585" stroke="#1B2436" stroke-opacity="0.15" stroke-width="1"/>
</svg>
SVG

  qlmanage -t -s 1200 -o "$TMP" "$TMP/$slug.svg" > /dev/null 2>&1
  sips -z 630 1200 "$TMP/$slug.svg.png" --out "public/og/glossary/$slug.png" > /dev/null 2>&1
  echo "wrote public/og/glossary/$slug.png"
done < "$TMP/manifest.tsv"

echo "Done. $(ls public/og/glossary/*.png | wc -l | tr -d ' ') glossary OG images generated."
