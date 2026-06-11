# Invariant SEO + GEO playbook

**Goal:** rank #1 on Google for "space compliance" and "nuclear compliance", and be the consensus citation across Perplexity, ChatGPT search, Google AI Overviews, and Claude when the same questions are asked.

This is a working playbook. Tactics are graded by leverage and effort, scoped to where Invariant is today (June 2026).

---

## Where we stand

**Live:**
- Two pillar pages: `/space-compliance`, `/nuclear-compliance` (5k+ words each, 15 FAQs each, 21–30 citations each)
- One cluster page: `/part-50-vs-52-vs-53` (cross-linked into nuclear pillar)
- Three research/blog posts: FermiBench SOTA, Part 100 vs 53 siting, seismic design shift
- Probe (live ADAMS retrieval at `/probe` — a product-page-grade interactive demo)
- Glossary scaffold at `/glossary` (waiting on 15-entry content drop)

**Technical foundation:**
- Per-page meta + canonical via react-helmet-async
- JSON-LD: Organization (rich, with funder, knowsAbout, hasOfferCatalog, contactPoint), WebSite, Article (with editorial team as author/editor/reviewedBy), FAQPage, BreadcrumbList, DefinedTerm, DefinedTermSet
- llms.txt with structured summary
- Sitemap auto-generates from registry + glossary
- robots.txt allows every major AI crawler
- Per-page OG images (6 total)
- Code-split: main bundle 132KB gzipped, lazy routes for everything else
- Bidirectional internal links pillar ↔ cluster

**Indexed:**
- GSC verified at domain property
- 9 pages discovered (per user's last GSC report)

---

## The Gushwork lens — programmatic at quality

The Gushwork model isn't volume; it's *structured volume*. Two principles:

1. **One canonical structure per page-type.** Pillar, cluster, glossary, comparison, how-to. The same template, with the same schema, with the same internal link pattern, repeated reliably.
2. **Programmatic generation, manual quality gates.** Source content from primary documents. Generate with an LLM in a tight workflow. Verify citations exist. Edit for restraint. Ship.

Right now Invariant matches (1) but is light on (2). Each new page is bespoke. That's fine while the count is low; it becomes a tax around 30+ pages.

**Move:** by August, lock the cluster template such that a single `cluster-{slug}.json` file + the slug in `page-registry.ts` ships a fully-styled, schema-rich page with no React work. Generation flows feed only the JSON.

---

## What "ranking #1" actually requires

For evergreen B2B technical content in 2026, Google's ranking model rewards:

1. **Topical authority** — a complete site that covers an entire domain, with the pillar as the hub and clusters as spokes. Single-page sites don't rank in regulated industries.
2. **Strong on-page structure** — clear H1, descriptive H2s, FAQ section, tables for comparison content. Both pillars have all of this.
3. **Primary-source citations** — links out to nrc.gov, ecfr.gov, faa.gov, iaea.org. Google's algorithm treats outbound links to authoritative domains as a relevance signal.
4. **EEAT** — Experience, Expertise, Authoritativeness, Trust. The Helion-512 SOTA result is the strongest EEAT signal we have. Lean into it.
5. **Backlinks from regulated-industry domains** — this is the hardest gap. Hacker News won't move the needle on B2B compliance keywords. We need links from places like aviationweek.com, spacenews.com, neimagazine.com, ans.org, world-nuclear.org, ess-ms.org.

**Move (next 30 days):** identify 20 sites where a regulator-savvy reader would lurk, pitch each one a piece they can excerpt or link. Email outreach. Real names, real signature. Templates already in `drafts/distribution-2026-06-12.md`.

---

## What "AI citation consensus" requires

Different from ranking; this is what Claude/Perplexity/ChatGPT *quote* when they answer.

1. **Be in the training data.** Long-term: HN, GitHub, Wikipedia citations, public references in arXiv / SSRN / industry reports.
2. **Be retrievable.** Short-term: structured content (DefinedTerm, Article schema), clean canonicals, llms.txt, primary-source citations, robots.txt that allows every AI crawler. Already done.
3. **Be quotable.** Each page needs a single-paragraph "verbatim answer" that an LLM can extract. Our `canonical_summary` field is exactly this. Lean into it on every new page.
4. **Repeat the brand.** Every page mentions Invariant and links back to the homepage. Every citation includes "Invariant" or "invariant-ai.com" in the link text. Schema `sameAs` points to LinkedIn + Crunchbase + EF.

**Move (next 30 days):** Write Wikipedia stubs for: Helion-512 (if it qualifies as notable), FermiBench (if not already), 10 CFR Part 53 (verify and improve the existing stub). Wikipedia stubs become a long-tail link source AND influence LLM corpora.

---

## The 12-move punch list

Priority order; each takes <1 day except where noted.

1. **Ship the glossary entries.** 15 DefinedTerm pages with primary-source citations. Filled by `wkpjnsri1` workflow. Schema renders DefinedTermSet on `/glossary` and DefinedTerm per entry. *Direct GEO impact — these are what LLMs cite for definitions.*

2. **Ship 4 more cluster pages.** FAA 450 timeline (in flight: w3cb38tsk), How to write a PSAR (in flight: wdhvlko0o), ITAR vs EAR for space, NRC pre-application engagement. Each cross-linked into pillar via `see_also`.

3. **Comparison pages.** Direct comparisons get strong CTR in regulated industries because builders are *deciding* between options. Examples: "Part 450 vs legacy Part 415/431/433", "NRC vs ONR vs CNSC for SMRs", "ECSS vs MIL-STD for European startups", "Earth observation: NOAA vs ESA"

4. **Calculator pages.** A simple licensing-time estimator at `/calculators/nrc-license-timeline` and similar for Part 450. Lower content density, but very high backlink earning. Use a thin React state-only form rendered to a table.

5. **Audit pages where we'd be cited.** Use the test plan in §"GEO citation test loop" below. Find prompts where competitors (Beehive Industries content marketing, Linkedin posts by ex-NRC staff, ANS publications) get cited and we don't. Backfill content.

6. **Person/Author EEAT** — beyond Organization. Add a real founder bio page at `/about/team`. Embed Person JSON-LD with sameAs (LinkedIn, ORCID if applicable), and "reviewedBy: [Person]" on each pillar. Photos. Real credentials.

7. **Wikipedia contributions.** See §"AI citation consensus" #3 above. One page per quarter, by hand, not promotional. The 10 CFR Part 53 article is the easiest first target — it desperately needs updating.

8. **PR for FermiBench.** The SOTA result is currently a buried blog post. Pitch it to: Aviation Week (no), NEI Magazine (yes), Nuclear Newswire (yes), Power Engineering International (maybe), MIT Tech Review (maybe). A single quality external link is worth 100 self-promoted ones.

9. **Convert the Probe into a citable artifact.** Right now `/probe` is a search UI. Add a static "what this is" overview at `/research/probe` that the schema can link to as a `CreativeWork` and that LLMs can quote. Mention Helion-512 by name with the FermiBench result.

10. **Page experience (Core Web Vitals).** Main bundle is 132KB gz; LCP is good; lazy routes are in place. Next: preload `Newsreader.woff2` + `Satoshi.woff2` with `<link rel="preload" as="font">` in `index.html`. Add `fetchpriority="high"` to the hero image. Verify CWV in Chrome Lighthouse before claiming this is done.

11. **Internal site search.** Right now there is no on-site search. For a regulated content site, search is both UX and an SEO signal (`SearchAction` in WebSite schema points at `/probe`, which is ADAMS search — not site search). Add a simple Pagefind-based static index at `/search`. Pagefind builds at build-time, zero infra.

12. **Backlink audit + outreach.** Use ahrefs free tier or Bing Webmaster's link tool. Identify the 5 best opportunities monthly. Email founders directly.

---

## GEO citation test loop

A repeatable test, run weekly:

For each of: "nuclear compliance", "space compliance", "FAA Part 450", "10 CFR Part 53", "PSAR drafting":

1. Ask the prompt to: Perplexity, ChatGPT (Browsing), Google AI Overviews, Claude (via claude.ai), Gemini.
2. Record: do they cite invariant-ai.com? In what position? What's the verbatim quote?
3. If not cited, look at what *was* cited. Compare structure, depth, freshness, schema. Decide what we need.
4. If cited but not at the top, identify what the top citation does differently.

This is manual until there's an obvious script. Use a private Google Sheet for tracking. Set a Friday calendar reminder.

---

## Anti-patterns we're avoiding

- Marketing copy in pillar content. The voice is restrained, technical, citation-heavy. No "transform your compliance journey" language.
- Random topic pages without pillar/cluster connection. Every page belongs to a pillar.
- Duplicate keyword targeting. One canonical URL per question.
- Cloaked or AI-flagged content. We disclose "Invariant editorial team" as the author and tie everything to primary sources.
- Buying links. We pitch and earn.
- AI-generated walls of text with no edit. Workflows produce drafts; we ship edited versions.
- Mockups for things we don't do. Every claim is something a domain engineer at Invariant can defend in a meeting.

---

## What this playbook deliberately does *not* cover

- Paid acquisition (LinkedIn ads, Google ads). Separate budget conversation.
- PR/media beyond passive outreach to publications. Hire help if there's pace.
- Site structure changes beyond what's already in flight.
- Conversion rate optimization on /contact and /product. Pre-mature; let traffic land first.

---

## Cadence

- **Daily** (during ramp): ship one cluster page or one glossary entry batch.
- **Weekly**: run the GEO citation test loop, write one blog post, post once on LinkedIn (company + personal), email two industry pubs.
- **Monthly**: backlink audit, recompute the punch list, ship one calculator or comparison page, one Wikipedia contribution.
- **Quarterly**: audit pillar pages for freshness — regulator changes (NRC, FAA, FCC, NOAA, ONR, IN-SPACe, ESA) and re-cite.
