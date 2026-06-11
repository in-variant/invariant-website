# Content roadmap — what to ship after tonight

Tonight we shipped the foundation: 2 pillars, 17 clusters, 90+ glossary entries, full schema, prerender, auto-generators, distribution drafts. The next 90 days are about maintaining content velocity, accumulating backlinks, and feeding the freshness signal that Google and LLMs both reward.

This document is the publishing cadence. It is intentionally modest — sustainable wins over theatrical bursts.

---

## Weekly cadence (every Monday)

**One new cluster page.** Pick from the backlog below. Brief the workflow (sample script in `scripts/` or copy the pattern from the most recent `cluster-*` workflows). Ship the page, regenerate sitemap, push.

**One LinkedIn post from the company page**, resharing from a personal account. Use the drafts in `drafts/distribution-2026-06-12.md` as templates.

**One Tuesday: run `npm run geo-test`** with all three API keys exported. Save the JSONL to `drafts/geo-results/{YYYY-MM-DD}.jsonl`. Review which queries we are not yet cited for and decide whether to write a new cluster or strengthen an existing one.

**One Friday: refresh a single existing pillar or cluster page.** Add a 2-3 sentence "Recently changed" callout at the top. Update the meta_description with the latest 2026 reference. Trivially small edits, but the lastmod date moves and Google notices.

---

## Monthly cadence (first of month)

**One Wikipedia submission attempt.** Use the stubs in `drafts/wikipedia-stubs.md`. Submit through Wikipedia's Articles for Creation queue with proper WP:PAID disclosure.

**Backlink audit.** Use ahrefs free tier or Bing Webmaster Tools. Identify 5 specific outlets where a regulator-savvy reader would be reading. Cold-email each one with a relevant cluster page that could be excerpted or linked.

**Audit `/glossary` for gaps.** As new regulations land (NRC publishes a regulatory guide, FAA releases an AC, etc.), add the glossary entry the same week. The workflow script template is `glossary-batch-N`.

**Refresh `/research`.** If we have shipped a new benchmark result, paper, or significant analysis, add it. Otherwise leave it alone.

---

## Cluster backlog (priority order)

1. **Japan nuclear compliance** — NRA, post-Fukushima safety standards, Kashiwazaki-Kariwa restart, HTGR experimental reactor.
2. **Korea nuclear compliance** — NSSC, APR1400, Hanul, Saeul.
3. **China nuclear compliance** — NNSA, HPR1000, CAP1000, post-Fukushima reforms.
4. **NRC Part 50 → Part 52 → Part 53 transition for a specific developer** — worked example showing the decision tree, citing real applicants.
5. **How to write a Means of Compliance for FAA Part 450** — already shipped, but consider a "common rejection patterns" follow-up.
6. **FCC Schedule S** — the orbital-debris narrative exhibit, with worked examples from real Part 25 applications.
7. **How to draft an ITAR EAR Means of Classification request** — bookend to the ITAR vs EAR cluster.
8. **NASA GEVS chapter-by-chapter** — for satellite operators tailoring their qualification spec.
9. **AERB Site Evaluation Code** — bookend to the Nuclear-India cluster.
10. **EUSPA IRIS2** — for satellite operators looking at EU sovereign-comms work.
11. **ITU Resolution 49 due diligence** — bookend to ITU-coordination cluster.
12. **FAA Letter of Investigation** — what happens when the agency questions a certification claim.
13. **NRC Public Hearing Process** — Atomic Safety and Licensing Board, intervention rules.
14. **Pre-application engagement under FAA Part 450** — distinct from the timeline cluster.
15. **Comparative regulator response timelines** — FAA vs NRC vs FCC vs NOAA reaction-to-application data.

Each cluster takes ~5-10 minutes of workflow time plus 5 minutes to integrate (write the page component, add to App.tsx and registry, regenerate sitemap, push). Two clusters per week is the upper bound that does not burn out the editorial team.

---

## Glossary backlog

The glossary now has 90+ entries (post-batch-6). The next batch should focus on:

- **Aerospace deep dive** — AC 25.1309-1B subsections, MIL-STD-882E, DO-330, DO-331, DO-332, DO-333
- **Space deep dive** — IADC-02-01 each guideline, ISO 24113, FAA AC 450.169-1A, NASA NPR 8715
- **Nuclear deep dive** — Reg Guide 1.232, 10 CFR Part 73 security, 10 CFR Part 71 transportation, Yucca Mountain

Pace: one batch of 15 every 4-6 weeks. The OG-image batch script handles per-entry preview cards automatically; the build step regenerates the sitemap and llms.txt. Once the workflow returns, the integration is roughly 3 commands.

---

## Distribution backlog

- **HN Show HN — Helion-512 reaches state of the art on FermiBench**. Once the FermiBench Wikipedia stub is accepted, refresh the post and resubmit (HN allows reposts after sufficient time).
- **Industry pub pitches** — Aviation Week (one a quarter), SpaceNews (one a quarter), NEI Magazine (one a quarter), Nuclear Newswire (one a quarter), AIAA Aerospace America (longer lead time).
- **Conference papers** — IEEE Aerospace, AIAA SciTech, ANS Annual Meeting, ESA Clean Space Forum. Submit one paper per cycle, even short ones, to accumulate scholarly citations.
- **Podcast outreach** — Decouple (nuclear), Off Nominal (space), AIN (aviation). Founders speak from a position of evidence (Helion-512 + content library + real clients).

---

## Indexing maintenance

- **Manual indexing requests** — twice a week, log into GSC and click "Request Indexing" for any URL that shows as Discovered-not-indexed for more than 14 days. GSC permits roughly 10 per day per property.
- **Sitemap re-submission** — happens automatically on every Vercel deploy (the build hooks regenerate sitemap.xml and the build-time prerender writes per-route HTML). If a push has not happened in 14 days, manually push a content update to trigger.
- **Composio script** — `composio execute GOOGLE_SEARCH_CONSOLE_INSPECT_URL` against priority URLs once a week. The output tells us coverage state. If "Crawled - currently not indexed" persists more than 30 days, that page needs more inbound links or stronger content.

---

## What success looks like at +30 / +60 / +90 days

- **+30 days** — At least 30 of the 70+ pillar/cluster/glossary URLs are indexed in Google. Sitemap reports >25 "indexed" out of submitted. GSC shows impressions for at least 10 head queries. We start seeing AI citations in Perplexity and ChatGPT Search for definitional queries (the glossary entries lead).

- **+60 days** — At least 60 URLs indexed. First click-through reports for the pillar pages. At least one external backlink (LinkedIn share counts, but a referring domain matters more). FermiBench Wikipedia stub submitted (acceptance pending).

- **+90 days** — At least 90 URLs indexed. The pillar pages start ranking for "nuclear compliance" and "space compliance" (first appearance, not necessarily #1). AI citation testing shows us in 3+ of the 10 test queries from `scripts/geo-citation-test.mjs`. Wikipedia FermiBench stub accepted; submit Helion-512 stub.

Real #1 ranking on the two head queries is a 6-12 month milestone after consistent content velocity + at least 3-5 referring domains from authoritative industry publications. There is no shortcut.
