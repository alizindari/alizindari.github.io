Self-attention blog: retained figure sources

Edit the article, captions, tags, and references in ../post5.ts.
The [[figure:name]] markers insert the corresponding entry in post5.figures.

figures.html preserves only slides 14-24, the self-attention introduction from
Ali Zindari's "Teaching Attention Where to Look" deck. Speaker notes are retained
as source context but aren't displayed. figures.css contains the source CSS
rules relevant to those slides. The blog's example uses Iran and Tehran.
The remaining talk and its data aren't needed.

Public assets: public/blog/self-attention/
  - Seven SVG article figures and the illustrated cover.png.
  - The original four TeX Gyre Termes font files and GUST font license in fonts/.

The article figures are cropped vector exports, not screenshots or recreated
lookalikes. Text and KaTeX math are outlined in the SVGs so browsers preserve
their original shapes at every zoom level. The post's prose uses the original
Termes fonts; live equations use the site's existing KaTeX fonts and renderer.
No slide CSS leaks into other posts.

The cover is a separate ink-and-watercolor illustration generated with the
built-in image generation tool, using the existing iced-tea, laundry, and
gradient-descent covers as style references. Its prompt is in cover-prompt.txt.
The figure renderer leaves this cover unchanged.

The article also writes out the causal mask
that the original slide 24 omitted for space and explained in its speaker notes.

Regenerate from the repository root:
  node scripts/render-self-attention.mjs

Requirements: Node.js 22+, the project's installed KaTeX dependency, Chromium
or Chrome (set CHROME_BIN if necessary), and pdftocairo from Poppler.
The renderer reads only the retained files and local fonts. It doesn't need
the original slides/ folder or network access. Temporary PDF files are removed.

The deck's original MIT license is included as LICENSE. The source template:
https://github.com/alizindari/academic-slide-poster-template
