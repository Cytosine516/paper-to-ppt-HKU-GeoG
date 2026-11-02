---
name: paper-to-ppt
description: Turn an academic paper (PDF) into an English paper-presentation PPT in the HKU Geography style: paper figures as visual centre, three-line tables, no AI-looking colour blocks. Use for 根据论文做PPT / 论文汇报.
---

# Paper → presentation deck (.pptx)

This skill builds a course-style paper presentation from one paper. The audience is a lecturer grading for depth and an audience that must grasp each slide in seconds. The finished deck should look like a careful student made it by hand in PowerPoint, not like a template generator.

If the user supplies their own reference deck or screenshots, its look wins over the defaults below. Match its fonts, header and colours, and keep every content rule.

## Bundled files

- `assets/paper-to-ppt-template-v5.pptx` and `assets/paper-to-ppt-template-v5.pdf`: the approved reference deck, built from Curtis et al. (2018), *Science*.
- `assets/example-build-curtis2018.js`: the pptxgenjs script that built the template. Use it as a starting point for the build script.
- `scripts/fixppr.py`: post-processing fix for duplicate paragraph properties (see step 5).

## Template deck (look for it first)

- Use the bundled template in `assets/`. If it is missing, look for `paper-to-ppt-template-v5.pptx` in the user's claude.ai Project ("PPT and Assignment") with the Projects tool, or among uploaded files.
- Render the PDF pages to images and look at every slide before designing. Copy the HKU Geography logo from the .pptx's `ppt/media/` folder.
- Match the template's layouts, spacing, fonts and colours. Replace only the content with the new paper's figures and findings. The template's text, numbers and figures belong to the Curtis paper and must never be carried over.
- On slide 6 of the template, the right-hand table holds derived values. Treat that layout as a slot for paper-reported values, unless the user approves derived ones (see Hard requirements).
- If no template is available, build from the layout specs in "Slide layouts" below, which reproduce it. Ask the user for the logo if no reference deck contains it.

## Confirm the scope with the user first

Before planning slides, ask the user in one AskUserQuestion call:

1. **Slide count:** how many slides in total. Suggest 9 including the cover as the default.
2. **Cover:** whether to include a cover slide (default: yes).
3. **Transition slides:** whether to include section-divider or transition slides (default: no).
4. **Missing details:** course code, paper number and presenter names for the cover, if they are not already known.

Use the answers as the plan. If the user is not available to answer, use the defaults (9 slides, cover, no transition slides) and say so at the top of the reply.

## Hard requirements (the user's standing rules)

- **Language:** all slide text and speaker notes are in English. Reply to the user in Chinese.
- **Data:** never invent or alter numbers. Every figure, table value and claim comes from the paper.
- **Derived numbers:** avoid computing new numbers from the paper's data (products, sums, differences, consistency checks). Build depth from what the paper reports. If a derived number would genuinely strengthen a slide, list each candidate with its formula and source and ask the user whether to include it before building. Include only the ones the user approves, and state the formula in that slide's footnote.
- **Figures:** every image that shows the study's design or results must be a screenshot or crop of the original paper. Auxiliary images (background context, the paper's first page, logos) may come from elsewhere if they cannot mislead. When unsure, ask the user to supply one.
- **No takeaway line at the bottom of a slide.** The slide's message lives in the green subtitle at the top. The bottom holds only the citation and page number.
- **No meta labels on slides.** Do not write "Presenter's note", "Presenter's calculation", "Takeaways", "Key insight" or similar. State the content directly.
- **The last slide is "Conclusions".** Build it on the authors' own conclusions (abstract plus discussion pages), not later literature. End with plain summarising sentences, not a "Takeaways" list.
- **Writing:** apply anti-defensive writing. Lead with the claim, state limitations once and plainly, and keep hedges only where the evidence requires them (e.g. "consistent with displacement; causality not tested").

## What "no AI flavour" means here

The user rejected these patterns in earlier versions. Avoid them:

- Icon-in-circle plus big-number plus caption cards. Avoid stat-callout tiles and 30pt coloured numbers standing alone.
- Coloured blocks or shaded boxes used to emphasise a single sentence, definition, note or conclusion.
- Coloured keywords inside body text. Use **bold** only.
- Tables with coloured header fills or zebra striping.
- Flow charts made of filled or bordered boxes with step numbers.
- One giant table filling the slide, or the figure shrunk to a thumbnail at the edge.
- Accent stripes, decorative bars, and a closing one-liner.
- Large empty areas, for example half a column left blank.

What the user liked:

- The figure is the visual centre. It doesn't have to be huge, but text and tables sit around it and help the reader read it.
- The green subtitle states the slide's message.
- Gray "01 / 02" numbers with green subheads.
- Plain academic three-line tables.
- Thin red boxes on a paper screenshot to point at the exact cells being discussed.
- Text large enough to read from the back of a room.

## Visual spec (HKU Geography / Kuang-deck style)

Use a 16:9 wide canvas (`LAYOUT_WIDE`, 13.333 × 7.5 in) and Times New Roman everywhere.

Content-slide frame (put it on one slide master):

- **Title:** top-left, 36pt bold, near-black `1A1A1A`, x 0.3, y 0.1, w 8.1, h 0.82, left-aligned.
- **Logo:** department logo top-right at x 8.45, y 0.2, w 4.7, h 0.594.
- **Rule:** a full-width dark-green rule at y 0.98, h 0.1, colour `0B5D35`.
- **Slide number:** bottom right at x 12.55, y 7.1, 12pt gray.
- **Subtitle:** green `2D6A4F`, 26pt bold, x 0.35, y 1.2, w 12.6, h 0.58, one line. This is the slide's message.
- **Content area:** y 1.95 to 6.95.
- **Sub-headings:** "01" in gray `9AA5A0` plus a heading in green, 21–22pt bold, h 0.48.
- **Body text:** 16–19pt. Never go below 16pt for body or table text.
- **Figure captions:** 13pt italic gray `6E6E6E`, e.g. "Author et al. (Year). Figure 2. Title."
- **Footer:** 12pt gray `8C8C8C` citation at x 0.35, y 7.08, w 12.0 (short reference, figure/table and page numbers, footnote definitions).
- **Accent colours:** use red `B23A2E` only for 1–3 emphasised table cells per slide and for thin boxes on screenshots. Gold `B8975A` small triangles may mark research questions.

Three-line tables, like the paper's own tables:

- **Rules:** no fills anywhere. A thick black line (1.5pt) on top and bottom, a thin black line under the header, and very light gray (`C8C8C8`, 0.5pt) solid rules between rows.
- **Alignment:** text columns (class, region, description) left-aligned. Numeric and short categorical columns (%, Mha, Yes/No, ±CI) centred, header included.
- **Emphasis:** sparing red-bold or bold on the few cells the slide talks about. Totals row in bold.

Flow / process diagrams:

- No boxes and no step numbers.
- Bold step name (20pt) with a 1–2 line description (17pt).
- Thick dark arrows (`404040`, 4pt line with a triangle head) between steps show the order.

## Slide layouts (from the approved v5 deck)

All positions are in inches on the 13.333 × 7.5 canvas. Figure heights follow the image's aspect ratio.

**L1 · Cover**
- **Left panel:** dark green `213D33`, x 0, y 0, w 7.55, h 7.5. Inside it:
  - gold `C9A56B` 36pt "Paper Presentation" (or "Paper 0X") at x 0.6, y 0.55;
  - white 40pt bold title at x 0.6, y 1.55, w 6.7, h 1.75;
  - gold 21pt bold italic scope subtitle at y 3.45;
  - a three-segment bar at y 4.55, h 0.13: gray `8E9C93` (w 1.6), gold `B8975A` (w 0.8), white (w 2.4);
  - "Journal:" / "Authors:" in 17pt white at y 4.9;
  - a white rounded box at x 0.6, y 6.32, w 3.75, h 0.72, holding the logo (w 3.45).
- **Right side:** the paper's first page at x 7.85, y 0.12, w 5.18, h 6.6, with a thin gray border and a 13pt italic caption at y 6.85.

**L2 · Two columns: text + small table (Background & Research Questions)**
- **Left column (x 0.45–6.55):**
  - "01" head at y 1.95;
  - 3–4 bullets (18pt, 9pt spacing) at y 2.55;
  - a bold-term definition sentence (18pt) at y 5.85, plain text with no box.
- **Right column (x 6.95–13.0):**
  - "02" head at y 1.95;
  - a three-line comparison table at y 2.5, w 6.0, with centred value columns;
  - "Research Questions" (21pt bold, black) at y 4.55;
  - 3 italic 17pt questions at y 5.1 / 5.8 / 6.3, each with a gold triangle.

**L3 · Figure left, interpreting table right (concepts / classes / framework)**
- **Left:** the paper figure at x 0.35, y 1.95, w 6.55, with a caption under it (about y 6.75).
- **Right:** a three-line table at x 7.05, y 1.95, w 6.0 (16pt, fixed row heights so it reaches about y 5.75), with a footnote line at y 6.0.

**L4 · Arrow flow on top, two columns below (methods & validation)**
- **Flow:** four steps at x = 0.4 + 3.2·i, y 1.98, w 2.6, h 1.3. Arrows at x + 2.66, y 2.63, w 0.44.
- **Left column:** "01" head at y 3.55; a three-line table at x 0.45, y 4.1, w 6.0 with a centred value column.
- **Right column:** "02" head at y 3.55; 2 bullets at y 4.1; one plain statement (18pt, bold key phrase) at y 5.4.

**L5 · Large figure left, narrow column right (headline result)**
- **Left:** the main figure at x 0.35, y 1.95, w 8.6. Legend strip below it, caption at about y 6.5.
- **Right column (x 9.25, w 3.8):**
  - green 20pt heading at y 1.95;
  - 14pt italic gray source note at y 2.37;
  - a two-column three-line table at y 2.75 (16pt, centred values);
  - 3 short bullets (16pt) at y 5.15.

**L6 · Paper table screenshot, bullets below, small table right (regional/breakdown results)**
- **Left:**
  - the paper's table screenshot at x 0.35, y 1.95, w 8.95, with thin red boxes on the cells discussed;
  - caption at y 4.97 explaining the boxes;
  - 3 bullets (16pt) at y 5.4.
- **Right column (x 9.6, w 3.45):** a green 19pt heading at y 1.95, a three-line table (15pt, centred numbers) at y 2.45, and a footnote caption at y 5.95.

**L7 · Two figures side by side (trend / comparison)**
- **Figures:** x 0.35 and x 6.85, each w 6.15, y 1.95. Captions at y 5.27.
- **Below each figure:** 3 bullets (17pt) at y 5.62.

**L8 · Cropped detail left, table + limits right (evaluation)**
- **Left:** the cropped figure detail at x 0.35, y 1.95, w 5.2. Caption at y 5.6, then a 17pt reading of the detail at y 5.98.
- **Right column (x 5.95, w 7.05):**
  - "01" head at y 1.92;
  - a three-line table at y 2.45 with centred numbers and red-bold key cells;
  - "02" head at y 4.6;
  - 3 bold-label bullets (18pt) at y 5.12.

**L9 · Conclusions**
- **Left:** the main result figure at x 0.35, y 1.95, w 5.9. Legend below it, caption at y 5.08, then a 16pt summary paragraph (the authors' headline conclusion, key numbers in bold) at y 5.45.
- **Right column (x 6.8, w 6.25):**
  - green 19pt heading at y 1.95 (e.g. "Implications by driver (authors' discussion)");
  - a two-column three-line table at y 2.45;
  - one 17pt closing paragraph from the authors' conclusions at y 5.95.

Pick a layout per slide by what its visual centre is, and vary layouts across the deck. Transition slides (only if the user asked) use the content frame with the section number in gray, the section name as a large title and one short descriptive line.

## Workflow

### 1. Read the inputs

- `pdftotext -layout paper.pdf paper.txt` and read the whole text. Note every number with its table, figure and page.
- `pdfinfo` for page size. `pdftoppm -png -r 300` for page renders. `pdfimages -list` and `pdfimages -j` to pull embedded raster figures at native resolution.
- Load the template deck (see "Template deck") and any reference the user supplies. Render them to images and look at the slides.
- Copy uploads into a working folder and work on the copies.

### 2. Plan the storyline (slide count as confirmed)

Fit the plan to the slide count, cover and transition choices the user confirmed. Give each content slide one paper figure or table as its visual centre, and assign it a layout L1–L9. The default 9-slide plan:

| # | Slide | Layout | Visual centre |
|---|---|---|---|
| 1 | Cover | L1 | Paper first page |
| 2 | Background & Research Questions | L2 | Small comparison table |
| 3 | Concepts / study design | L3 | Paper figure of classes, study area or framework |
| 4 | Methods & validation | L4 | Arrow flow plus accuracy/data table |
| 5 | Result I (headline) | L5 | Key paper figure |
| 6 | Result II (breakdown) | L6 | Paper table screenshot |
| 7 | Result III (trend/comparison) | L7 | Two paper figure panels |
| 8 | Evaluation | L8 | Cropped figure detail |
| 9 | Conclusions | L9 | Main result figure |

For fewer slides, merge results slides or fold methods into the concepts slide. For more slides, give each major result its own slide rather than padding.

### 3. Add depth from the paper's own content

The user asked for original thinking, not surface summary. Get depth by reading the paper closely, not by computing new numbers:

- Put two reported results side by side so the contrast is visible. Examples: regional rows of a table that pull in opposite directions, or map-based vs sample-based estimates the paper reports.
- Point to where the paper's own estimates disagree (e.g. a value outside a reported confidence interval) and connect it to the paper's explanation (classes that look alike, too few samples).
- Name design choices and their consequences: unit of analysis, definitions, what is out of scope, and what the validation does and does not cover.
- Read the figures actively: what pattern the map or chart shows, and which reported number confirms it.

Keep claims proportionate. Use "consistent with" for patterns the paper did not test.

If a derived number would add real insight, don't put it on a slide yet. Collect such candidates and ask the user in one question, giving each value, its formula and the source table or figure. Include only what the user approves, and footnote the formula.

### 4. Prepare figure crops

- Prefer the embedded image from `pdfimages` for maps and photos. Crop panels from the 300-dpi page render for vector charts and tables.
- Keep panel letters, axes, legends and labels inside the crop. View every crop before using it and widen the crop if a label is cut.
- Keep the aspect ratio when placing images (compute h = w × img_h / img_w).
- Highlight boxes on a screenshot: map pixel coordinates with `k = placed_width / image_width` and draw transparent-fill rectangles with a thin red line.
- Caption every figure with author, year and figure number. Mention any highlight ("Boxed: …").

### 5. Build with pptxgenjs

Load the pptx skill first for its gotchas and scripts. Then copy `assets/example-build-curtis2018.js` as a starting point and replace the content. It already contains the helpers below.

```js
// Plain three-line table. o: {x,y,w,colW,rowH?,fs?,center?:[colIdx]}
function table(s, head, body, o) {
  const fs = o.fs || 16, none = { type: "none" };
  const thick = { type: "solid", pt: 1.5, color: "1A1A1A" };
  const thin = { type: "solid", pt: 0.75, color: "1A1A1A" };
  const row = { type: "solid", pt: 0.5, color: "C8C8C8" };
  const al = j => (o.center && o.center.includes(j) ? "center" : "left");
  const rows = [head.map((h, j) => ({ text: h, options: { bold: true, color: "1A1A1A", fontSize: fs, valign: "bottom", align: al(j), border: [thick, none, thin, none] } }))];
  body.forEach((r, i) => rows.push(r.map((c, j) => {
    const base = { fontSize: fs, color: "1A1A1A", valign: "middle", align: al(j), border: [none, none, i === body.length - 1 ? thick : row, none] };
    return typeof c === "string" ? { text: c, options: base } : { text: c.text, options: Object.assign({}, base, c.options) };
  })));
  s.addTable(rows, { x: o.x, y: o.y, w: o.w, colW: o.colW, rowH: o.rowH, margin: [4, 6, 4, 6], fontFace: "Times New Roman", autoPage: false });
}
// Emphasis cell: { text: "+17", options: { bold: true, color: "B23A2E" } }
```

Other build notes:

- **Bullets with mixed bold/plain runs:** put `bullet: true` only on the first run of each item and `breakLine: true` on the last run of every item except the last. pptxgenjs still writes a duplicate `<a:pPr>` into some paragraphs, so run `python scripts/fixppr.py deck.pptx` after `writeFile` and before validating.
- **Non-breaking spaces:** use NBSP (` `) inside "30 m", "5 Mha", "≈ 77" and "61 ± 13%" so numbers never split from their units.
- **Speaker notes:** every slide gets English notes (`slide.addNotes`) of 120–200 words that walk through the figure.

### 6. QA every slide visually

- Run the pptx skill's `validate.py`. Then convert to PDF with its `soffice.py`, run `pdftoppm -jpeg -r 110`, and look at every slide image. Compare each slide with the template slide of the same layout.
- **Check for:**
  - text overflow or overlap (footnotes colliding with tables is common);
  - numbers split across lines;
  - table headers wrapping mid-word (widen the column or shorten cell text);
  - large blank areas (rebalance: move blocks up, enlarge the table or figure, or add one more substantive point from the paper);
  - inconsistent bold in row labels;
  - any leftover "Presenter's" or "Takeaway" text (grep the extracted slide text);
  - any number that is not in the paper and was not approved by the user;
  - any text or number left over from the template paper.
- Fix the build script, rebuild, re-render the changed slides, and repeat until clean.

### 7. Deliver

- Send the .pptx file. Bump the version suffix (`_v2`, `_v3` …) when revising so earlier versions survive.
- Reply briefly in Chinese: the slide list with each slide's visual centre, what analysis was added, any derived values the user approved (and where they are footnoted), and what the user still needs to fill in (course code, paper number, names).
- When the user gives feedback, change only what they asked and keep everything else stable.
