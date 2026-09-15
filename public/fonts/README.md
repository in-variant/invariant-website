# Figma website fonts

- Geist and Geist Mono: self-hosted variable WOFF2, from Google Fonts; SIL OFL 1.1. Use `Geist` for body copy and `Geist Mono` for micro headings, labels and CTAs.
- Inter Tight and JetBrains Mono: self-hosted variable WOFF2, from Google Fonts; SIL OFL 1.1. Included for exact styles appearing in the website frame.
- D-DIN Regular: self-hosted WOFF2 from [Datto’s font repository](https://github.com/amcchord/datto-d-din); SIL OFL 1.1. Use the distinct family name `D-DIN` as the temporary heading fallback.

The Figma design uses **DIN Medium** for headings. This exact font was not found in the repository, installed fonts, Downloads, Documents, or Invariant design directories. `figma-fonts.css` includes a local-only `DIN` face resolving installed `DIN Medium`/`DIN-Medium`. D-DIN Regular is a close DIN-family fallback, but it does not reproduce DIN Medium exactly. Supply the licensed DIN Medium webfont to make the heading typography exact.

Google Fonts source stylesheet: https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Inter+Tight:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap

Each family’s license is included beside its font files. Latin and Latin extended subsets are supplied for the variable families.

## Desktop installation

Full variable TrueType versions of Geist, Geist Mono, Inter Tight, and JetBrains Mono were installed to `~/Library/Fonts` from the Google Fonts repository. D-DIN Regular was installed there from Datto’s font repository. Exact DIN Medium is not present; the expanded search also checked installed app bundles and Figma/Adobe application-support directories.

The desktop homepage now renders its static DIN headings using exact outlined text exported from the supplied Figma document. These are isolated transparent SVG paths in `public/figma/type`, with original layout boxes and per-line outline bounds recorded in `manifest.json`. The semantic heading text remains in the DOM. At tablet/mobile widths, live D-DIN text reflows naturally. These outlines are artwork assets, not an installed DIN font.
