# Invariant — Design System

The single source of truth for Invariant's visual brand. Every color, gradient,
and layout decision on the website should trace back to this document.

> **In one line:** Invariant is **cool, structured, and quiet**. Navy leads, the
> message leads, and warmth is a rare accent — never the star.

---

## 1. Brand Philosophy

Invariant should *feel* like:

| Weight | Quality |
| ------ | ------------ |
| **80%** | Structure |
| **15%** | Intelligence |
| **5%** | Momentum |

Color should communicate, in this order:

> **Calm → Trust → Progress**

It should **never** communicate:

> ~~Excitement → Innovation → Disruption~~

Structure dominates. Intelligence is the undertone. Momentum is the spark you
notice only once — a single copper detail, never a wall of it.

---

## 2. Color System

The palette is split into **Primary** (the ~75% that builds every screen) and
**Accent** (the ~15% that should *never dominate*). The remaining slack is
whitespace and restraint.

### Primary Colors — used ~75% of the time

| # | Token | Name | HEX | RGB | Meaning | Usage |
| - | ----- | ---- | --- | --- | ------- | ----- |
| 01 | `midnight` | **Midnight Infrastructure** — Primary Brand Color | `#1B2436` | `27 36 54` | Authority | **35%** |
| 02 | `observatory` | **Observatory Blue** — Secondary Foundation | `#425D77` | `66 93 119` | Systems | **20%** |
| 03 | `mineral` | **Mineral Grey** — Primary Background | `#D9D6D1` | `217 214 209` | Quiet confidence | **20%** |
| 04 | `cloud` | **Cloud Grey** — Secondary Background | `#ECEAE7` | `236 234 231` | Breathing room | **10%** |

**Where each is used**

- **01 · Midnight Infrastructure** — logo, navigation, primary CTA, headings, footer, dark sections.
- **02 · Observatory Blue** — diagrams, cards, illustration surfaces, gradients.
- **03 · Mineral Grey** — page backgrounds, cards, whitespace.
- **04 · Cloud Grey** — alternate sections.

### Accent Colors — used ~15% total

> These should **NEVER dominate.**

| # | Token | Name | HEX | Meaning | Usage |
| - | ----- | ---- | --- | ------- | ----- |
| 05 | `copper` | **Dusk Copper** | `#C57A3E` | Progress | **5%** |
| 06 | `peach` | **Dust Peach** | `#E4CBBE` | Humanity | **3%** |
| 07 | `lavender` | **Muted Lavender** | `#7F7A93` | Intelligence | **2%** |

**Where each is used**

- **05 · Dusk Copper** — active states, highlights, moments of motion. *(The one spark. Use it like punctuation.)*
- **06 · Dust Peach** — atmospheric gradients, illustrations.
- **07 · Muted Lavender** — hover, subtle states.

> Usage percentages are directional targets for the *whole site*, not a rule for
> any single screen. The intent is the ratio: overwhelmingly cool and structural,
> with warmth as a deliberate, sparing accent.

---

## 3. Color Restrictions

### Never

- ❌ Orange buttons
- ❌ Orange text
- ❌ Full-page gradients
- ❌ Pure white (`#FFFFFF`)
- ❌ Black backgrounds (`#000000`)
- ❌ Bright blues
- ❌ High saturation

### Avoid

- More than **3 colors in one section.**

> Backgrounds are **Mineral Grey / Cloud Grey**, not white. Dark surfaces are
> **Midnight Infrastructure**, not black. Copper is for *state and motion*, never
> for a button fill or body text.

---

## 4. Gradient System

**Only 3 approved gradients.** No others. Never apply a gradient to a full page.

### Gradient A — Atmospheric

```
#ECEAE7  →  #D9D6D1  →  #E4CBBE
(Cloud Grey → Mineral Grey → Dust Peach)
```

**Use:** Hero backgrounds.

### Gradient B — Observatory

```
#425D77  →  #7F7A93  →  #ECEAE7
(Observatory Blue → Muted Lavender → Cloud Grey)
```

**Use:** Illustrations.

### Gradient C — Horizon

```
#1B2436  →  #425D77  →  #C57A3E
(Midnight Infrastructure → Observatory Blue → Dusk Copper)
```

**Use:** Rare storytelling sections only.

---

## 5. Direction — Current → Target

The existing site skews warm and illustration-led. The brand pulls it cool,
navy-led, and message-led.

| Dimension | Current | Target |
| --------- | ------- | ------ |
| **Color balance** | 60% warm / 40% cool | **75% cool / 25% warm** |
| **Color lead** | Orange leads | **Navy leads** |
| **Visual hierarchy** | Illustration leads | **Message leads** |

**What this means in practice**

1. Recede the warmth — copper/peach become accents, not surfaces or fills.
2. Lead with **Midnight Infrastructure** navy for brand, nav, headings, CTAs.
3. Let the **copy** carry each section; imagery and gradients support, never compete.

---

## 6. Implementation

### Design tokens

Add to `tailwind.config.js` under `theme.extend.colors`:

```js
colors: {
  // Primary
  midnight:    '#1B2436', // 01 Midnight Infrastructure — brand, nav, CTA, headings, footer
  observatory: '#425D77', // 02 Observatory Blue — diagrams, cards, gradients
  mineral:     '#D9D6D1', // 03 Mineral Grey — primary background
  cloud:       '#ECEAE7', // 04 Cloud Grey — alternate sections
  // Accent (never dominate)
  copper:      '#C57A3E', // 05 Dusk Copper — active / highlight / motion
  peach:       '#E4CBBE', // 06 Dust Peach — atmospheric gradients, illustrations
  lavender:    '#7F7A93', // 07 Muted Lavender — hover, subtle states
}
```

### Semantic aliases

| Role | Token |
| ---- | ----- |
| Page background | `mineral` (`#D9D6D1`) |
| Alternate section background | `cloud` (`#ECEAE7`) |
| Dark / inverted surface | `midnight` (`#1B2436`) |
| Primary text & headings | `midnight` (`#1B2436`) |
| Primary CTA fill | `midnight`; text `cloud` |
| Active / focus / motion | `copper` (`#C57A3E`) |
| Hover / subtle state | `lavender` (`#7F7A93`) |

### Gradients (CSS)

Default direction is top → bottom (`180deg`); keep them contained to a section.

```css
:root {
  --gradient-atmospheric: linear-gradient(180deg, #ECEAE7 0%, #D9D6D1 55%, #E4CBBE 100%);
  --gradient-observatory: linear-gradient(180deg, #425D77 0%, #7F7A93 55%, #ECEAE7 100%);
  --gradient-horizon:     linear-gradient(180deg, #1B2436 0%, #425D77 55%, #C57A3E 100%);
}
```

| Variable | Approved use |
| -------- | ------------ |
| `--gradient-atmospheric` | Hero backgrounds |
| `--gradient-observatory` | Illustrations |
| `--gradient-horizon` | Rare storytelling sections |

### Quick checklist before shipping a screen

- [ ] Background is Mineral or Cloud grey — **not** white.
- [ ] Dark surfaces are Midnight — **not** black.
- [ ] Navy leads; the section reads as cool, not warm.
- [ ] Copper appears only on state/motion, and only as a touch.
- [ ] No more than 3 colors in the section.
- [ ] If there's a gradient, it's one of the 3 approved, and not full-page.
- [ ] The **message** is the focal point, not the imagery.
