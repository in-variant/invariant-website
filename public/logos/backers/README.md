# Backer brand assets

Reviewed 15 September 2026. The list of backers is supplied by Invariant's founders.

## Entrepreneur First

- Official site: https://www.joinef.com/
- Original, unmodified horizontal SVG: https://www.joinef.com/wp-content/themes/joinef2023/img/framework/logo-new.svg
- Local file: `entrepreneurs-first.svg`.
- Its exact geometry is preserved. CSS displays it in white on the dark hero.

## NPU Ventures

- Official site: https://npu.vc/
- **Current displayed logo:** `npu-provided.svg`, a display wrapper for the exact 200×200 PNG supplied by the user as `codex-clipboard-81bfea37-3d26-4a63-a5d3-8aa8b81c8887.png`.
- The source is retained byte for byte at `npu-provided.png` and embedded unchanged in the SVG. No lettering was recreated, generated, or traced.
- The viewport `16 72 168 58` removes the large empty source margins. A code-native alpha mask removes the white canvas, displays the original NPU lettering in white, and retains the original blue, orange, and green chevron pixels. The source's ink is displayed well below its native resolution for clear edges at the small partner-row size.
- This replaces the earlier live-text `NPU VENTURES` treatment. The source image says `NPU`; its accessible label remains `NPU Ventures`.

## Transpose Platform

- The user confirmed that “Transpose Capital” refers to Transpose Platform at https://www.transposeplatform.vc/.
- Local file: `transpose-platform.svg`.
- This is the exact inline SVG from the official homepage's `logo nav_logo` element, viewBox `0 0 249 32`.
- No paths or geometry were changed. CSS displays its `currentColor` artwork in white.

## Boundless Ventures

- The user confirmed the Indian AI investment firm at https://www.boundlessvc.com/.
- **Current displayed logo:** `boundless-provided.png`, explicitly supplied by the user on 15 September 2026 as `codex-clipboard-da5e14a4-2074-4097-9c9e-bcbd1e76d518.png`.
- The 1012×675 source PNG is retained byte for byte. It is not regenerated, traced, or resampled.
- The homepage and engineering preview display the exact source through an inline SVG luminance mask. An inverse component transfer makes its black ink white on the hero, while the white source canvas becomes transparent. The viewport `190 268 633 136` excludes the source's large outer margins while retaining a few pixels around the original ink.
- The previously used official header asset remains at `boundless-ventures.svg` for provenance, but is no longer displayed. Its original source was https://www.boundlessvc.com/media_1ba3cc35168b28b8b28ef805090d4e946275ec8d4.svg, referenced by https://www.boundlessvc.com/nav.plain.html.

## Layout

The four marks use individual optical widths and shared centre alignment. The secondary desktop row uses widths of 195, 155, 92, and 60 design units for EF, Transpose, Boundless, and NPU, with 52-unit gaps: 658 design units in total. Visible mark heights are approximately 14–20 units, below the hero buttons' height. The row has a 20-unit minimum height and a 14-unit gap below its 10-unit label. Mobile uses two rows of two in a maximum 290px width, with 14px vertical gaps and respective logo widths of 135px, 115px, 80px, and 54px. No backer is hidden on mobile. The engineering preview uses the same assets and optical sizing.
