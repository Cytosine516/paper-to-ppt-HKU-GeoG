const pptxgen = require("pptxgenjs");
const { applyTheme } = require("./apply_theme.js") /* from the pptx skill: scripts/apply_theme.js */;

const F = "./fig/";
const THEME = {
  name: "HKU Geography Serif",
  headFontFace: "Times New Roman", bodyFontFace: "Times New Roman",
  colors: { dk1: "1A1A1A", lt1: "FFFFFF", dk2: "0B5D35", lt2: "F3EBDD", accent1: "0B5D35", accent2: "2D6A4F", accent3: "B23A2E", accent4: "B8975A", accent5: "9AA5A0", accent6: "C9DEC6", hlink: "2D6A4F", folHlink: "B23A2E" },
};
const H = { rule: "0B5D35", green: "2D6A4F", red: "B23A2E", gold: "B8975A", num: "9AA5A0", beige: "F3EBDD", lgreen: "C9DEC6", text: "1A1A1A", gray: "8C8C8C", alt: "F1F4F0", border: "CDD5CF", cover: "213D33", teal: "2A7A8C" };
const CIT = "Curtis, P. G. et al. (2018). Classifying drivers of global forest loss. Science, 361(6407), 1108–1111.";

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: "Times New Roman", bodyFontFace: "Times New Roman" };
  pres.title = "Classifying drivers of global forest loss";
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: "FFFFFF" },
    objects: [
      { image: { path: F + "logo_geog.png", x: 8.45, y: 0.2, w: 4.7, h: 0.594 } },
      { rect: { x: 0, y: 0.98, w: 13.333, h: 0.1, fill: { color: H.rule }, line: { color: H.rule, width: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: 0.3, y: 0.1, w: 8.1, h: 0.82, fontSize: 36, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0 }, text: "Title" } },
    ],
    slideNumber: { x: 12.55, y: 7.1, w: 0.5, h: 0.3, fontSize: 12, color: H.gray, align: "right" },
  });

  const T = (t, o = {}) => ({ text: t, options: o });
  function content(title, subtitle, notes, cite) {
    const s = pres.addSlide({ masterName: "CONTENT" });
    s.addText(title, { placeholder: "title" });
    if (subtitle) s.addText(subtitle, { x: 0.35, y: 1.2, w: 12.6, h: 0.58, fontSize: 26, bold: true, color: H.green, margin: 0, valign: "middle", isTextBox: true });
    s.addText(cite || CIT, { x: 0.35, y: 7.08, w: 12.0, h: 0.32, fontSize: 12, color: H.gray, margin: 0, valign: "middle", isTextBox: true });
    s.addNotes(notes);
    return s;
  }
  function caption(s, t, x, y, w, h = 0.32) {
    s.addText(t, { x, y, w, h, fontSize: 13, italic: true, color: "6E6E6E", margin: 0, valign: "top", isTextBox: true });
  }
  function head(s, num, t, x, y, w, color = H.green, fs = 22) {
    s.addText([T(num + "  ", { color: H.num, bold: true }), T(t, { color, bold: true })], { x, y, w, h: 0.48, fontSize: fs, margin: 0, valign: "middle", isTextBox: true });
  }
  function bullets(s, items, x, y, w, h, fs = 18, gap = 6) {
    const arr = items.map((it, i) => {
      const runs = Array.isArray(it) ? it : [T(it)];
      return runs.map((r, j) => ({ text: r.text, options: Object.assign({}, r.options, j === 0 ? { bullet: true } : {}, j === runs.length - 1 && i < items.length - 1 ? { breakLine: true } : {}) }));
    }).flat();
    s.addText(arr, { x, y, w, h, fontSize: fs, color: H.text, margin: 0, paraSpaceAfter: gap, valign: "top", isTextBox: true });
  }
  // Plain three-line table in the style of the paper's Table 1: no fills, no colour.
  function table(s, head, body, o) {
    const fs = o.fs || 16;
    const none = { type: "none" };
    const thick = { type: "solid", pt: 1.5, color: "1A1A1A" };
    const thin = { type: "solid", pt: 0.75, color: "1A1A1A" };
    const dot = { type: "solid", pt: 0.5, color: "C8C8C8" };
    const n = body.length;
    const al = (j) => (o.center && o.center.includes(j) ? "center" : (o.right && o.right.includes(j) ? "right" : "left"));
    const rows = [head.map((h, j) => ({ text: h, options: { bold: true, color: H.text, fontSize: fs, valign: "bottom", align: al(j), border: [thick, none, thin, none] } }))];
    body.forEach((r, i) => rows.push(r.map((c, j) => {
      const base = { fontSize: fs, color: H.text, valign: "middle", align: al(j), border: [none, none, i === n - 1 ? thick : dot, none] };
      if (typeof c === "string") return { text: c, options: base };
      const opt = Object.assign({}, c.options); delete opt.fill;
      return { text: c.text, options: Object.assign({}, base, opt) };
    })));
    s.addTable(rows, { x: o.x, y: o.y, w: o.w, colW: o.colW, rowH: o.rowH, margin: [4, 6, 4, 6], fontFace: "Times New Roman", autoPage: false });
  }
  function box(s, x, y, w, h, fill, line) {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: line || fill, width: line ? 1.25 : 0 } });
  }
  function tri(s, x, y) {
    s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x, y, w: 0.22, h: 0.2, rotate: 90, fill: { color: H.gold }, line: { color: H.gold, width: 0 } });
  }
  const R = (t) => T(t, { bold: true });
  const G = (t) => T(t, { bold: true });
  const B = (t) => T(t, { bold: true });

  // ───────── 1 · Cover
  {
    const s = pres.addSlide();
    s.background = { color: "FFFFFF" };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 7.55, h: 7.5, fill: { color: H.cover }, line: { color: H.cover, width: 0 } });
    s.addText("Paper Presentation", { x: 0.6, y: 0.55, w: 6.6, h: 0.75, fontSize: 36, color: "C9A56B", margin: 0, valign: "middle", isTextBox: true });
    s.addText("Classifying drivers of global forest loss", { x: 0.6, y: 1.55, w: 6.7, h: 1.75, fontSize: 40, bold: true, color: "FFFFFF", margin: 0, valign: "top", isTextBox: true });
    s.addText("Deforestation versus temporary forest loss worldwide, 2001–2015", { x: 0.6, y: 3.45, w: 6.6, h: 0.85, fontSize: 21, bold: true, italic: true, color: "C9A56B", margin: 0, valign: "top", isTextBox: true });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.55, w: 1.6, h: 0.13, fill: { color: "8E9C93" }, line: { color: "8E9C93", width: 0 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 2.2, y: 4.55, w: 0.8, h: 0.13, fill: { color: "B8975A" }, line: { color: "B8975A", width: 0 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: 4.55, w: 2.4, h: 0.13, fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 0 } });
    s.addText([
      T("Journal: ", { bold: true }), T("Science (2018), 361(6407): 1108–1111", { breakLine: true }),
      T("Authors: ", { bold: true }), T("Philip G. Curtis, Christy M. Slay, Nancy L. Harris, Alexandra Tyukavina, Matthew C. Hansen"),
    ], { x: 0.6, y: 4.9, w: 6.7, h: 1.2, fontSize: 17, color: "FFFFFF", margin: 0, paraSpaceAfter: 4, valign: "top", isTextBox: true });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 6.32, w: 3.75, h: 0.72, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 0 } });
    s.addImage({ path: F + "logo_geog.png", x: 0.75, y: 6.47, w: 3.45, h: 0.436 });
    s.addImage({ path: F + "page1.png", x: 7.85, y: 0.12, w: 5.18, h: 6.6 });
    s.addShape(pres.shapes.RECTANGLE, { x: 7.85, y: 0.12, w: 5.18, h: 6.6, fill: { color: "FFFFFF", transparency: 100 }, line: { color: "D0D0D0", width: 0.75 } });
    caption(s, "First page of the article (Science, 14 September 2018)", 7.85, 6.85, 5.18);
    s.addNotes("Today I present Curtis and colleagues' 2018 Science paper, Classifying drivers of global forest loss. Global satellite maps show where trees disappear. This paper asks why, and separates permanent deforestation from forest loss that is followed by regrowth.");
  }

  // ───────── 2 · Background
  {
    const s = content("Background & Research Questions", null,
      "About 450 companies pledged zero deforestation in their supply chains by 2020. To act, they need to know where deforestation happens, but their sourcing runs through aggregators, so most see only their direct supplier. Global Forest Watch, built on Hansen and colleagues' Landsat maps, became the standard global monitor of tree cover loss. The problem is that tree cover loss is not deforestation. Deforestation is permanent: land with trees becomes land without trees, and nothing grows back. Forestry, shifting cultivation and wildfire also remove trees, but the forest returns. Mixing the two confuses comparisons with national land-use statistics. So the paper asks three questions: which driver dominates each 10-kilometre cell, how much of global loss is permanent deforestation, and whether that deforestation has declined.", CIT + " Introduction, p. 1108.");
    s.addText("Tree cover loss is not the same as deforestation", { x: 0.35, y: 1.2, w: 12.6, h: 0.58, fontSize: 26, bold: true, color: H.green, margin: 0, valign: "middle", isTextBox: true });
    head(s, "01", "Pledges need location data", 0.45, 1.95, 6.2, H.green);
    bullets(s, [
      [T("Nearly "), B("450 companies"), T(" pledged zero deforestation in supply chains by "), B("2020")],
      [T("Sourcing passes through aggregators; firms rarely see beyond their "), B("direct supplier")],
      [B("Global Forest Watch"), T(" maps annual tree cover loss from Landsat (Hansen et al., 2013), but not its cause")],
      [T("Loss maps compared directly with national land-use inventories create "), B("confusion"), T(" (e.g. FAO Forest Resources Assessment)")],
    ], 0.55, 2.55, 6.0, 3.2, 18, 9);
    s.addText([B("Deforestation"), T(" (paper's definition): an abrupt change from land with trees to land without trees, with no subsequent regrowth.")], { x: 0.55, y: 5.85, w: 6.0, h: 1.1, fontSize: 18, color: H.text, margin: 0, valign: "top", isTextBox: true });

    head(s, "02", "Loss maps show where, not why", 6.95, 1.95, 6.2, H.green);
    table(s, ["", "Permanent conversion", "Temporary loss"], [
      [{ text: "Drivers", options: { bold: true } }, "Commodity-driven deforestation; urbanization", "Forestry; shifting agriculture; wildfire"],
      [{ text: "After loss", options: { bold: true } }, "Non-forest land use", "Forest regrows"],
    ], { x: 7.0, y: 2.5, w: 6.0, colW: [1.3, 2.45, 2.25], fs: 16, center: [1, 2] });
    s.addText("Research Questions", { x: 7.0, y: 4.55, w: 6.0, h: 0.45, fontSize: 21, bold: true, color: H.text, margin: 0, valign: "middle", isTextBox: true });
    const rq = [
      "Which driver dominates forest loss in each 10 km cell, 2001–2015?",
      "How much of global loss is permanent deforestation?",
      "Has commodity-driven deforestation declined since 2001?",
    ];
    rq.forEach((r, i) => {
      const yy = [5.1, 5.8, 6.3][i];
      tri(s, 7.02, yy + 0.1);
      s.addText(r, { x: 7.4, y: yy, w: 5.65, h: 0.64, fontSize: 17, italic: true, color: H.text, margin: 0, valign: "top", isTextBox: true });
    });
  }

  // ───────── 3 · Five drivers
  {
    const s = content("Five Drivers of Forest Loss", "Classes are defined by what happens after the trees are removed",
      "These are the paper's training images, one per class. The model assigns each 10-kilometre cell to the driver that dominates its loss. The table reads each image by what follows the loss. Commodity-driven deforestation turns forest into farmland, including oil palm, or into mines and energy infrastructure, and the forest does not return. Shifting agriculture clears small patches, farms them, then abandons them, so secondary forest grows back. Forestry harvests managed forests and plantations that regrow. Wildfire burns large areas without human conversion, and the forest regenerates slowly. Urbanization is permanent too, but it is reported separately because different actors clear land for cities. Only two of the five classes count as deforestation; regrowth is the dividing line for the whole paper.",
      CIT + " Fig. 1; pp. 1108–1109.");
    s.addImage({ path: F + "f1_full.png", x: 0.35, y: 1.95, w: 6.55, h: 4.766 });
    caption(s, "Curtis et al. (2018). Figure 1. Google Earth imagery used to train the model.", 0.35, 6.75, 6.6);
    table(s, ["Class", "After the loss", "Deforestation"], [
      ["Commodity-driven deforestation", "Agriculture (incl. oil palm), mining, energy", { text: "Yes", options: { bold: true, color: H.red } }],
      ["Shifting agriculture", "Farmed and abandoned; forest regrows", "No"],
      ["Forestry", "Managed forest or plantation; regrows", "No"],
      ["Wildfire", "Burned, no conversion; regrows slowly", "No"],
      ["Urbanization", "Urban land", { text: "Yes*", options: { bold: true, color: H.red } }],
    ], { x: 7.05, y: 1.95, w: 6.0, colW: [1.95, 2.4, 1.65], rowH: [0.42, 0.72, 0.72, 0.72, 0.72, 0.5], fs: 16, center: [2] });
    s.addText([T("*"), T("Reported separately: the actors clearing land for cities differ from those clearing for commodities.")], { x: 7.15, y: 6.0, w: 5.9, h: 0.75, fontSize: 16, color: H.text, margin: 0, valign: "top", isTextBox: true });
  }

  // ───────── 4 · Method
  {
    const s = content("Classification & Validation", "A decision tree trained on labelled imagery, checked by an independent sample",
      "Here is the method. The input is the Hansen tree cover loss layer. The authors labelled nearly 5,000 cells by eye from high-resolution Google Earth imagery. A decision tree learned from these labels and predicted the most likely driver for every 10-kilometre cell. A separate random sample of 1,565 cells measured accuracy and gave sample-based driver shares with 95 percent confidence intervals. Accuracy is 89 percent overall, 94 percent for deforestation, and only 55 percent for urbanization, the smallest class. Forestry is easy to spot in North America, 96 percent, and harder in Southeast Asia, 78 percent, where harvested plantations look like new oil palm. One point the paper does not stress: both estimates give each cell a single dominant driver, so the confidence intervals do not capture minority drivers inside a cell.",
      CIT + " pp. 1108–1110.");
    const steps = [["Input", "Tree cover loss, Landsat 30 m, 2001–2015"], ["Training", "Nearly 5,000 cells labelled from Google Earth"], ["Model", "Decision tree: dominant driver per 10 km cell"], ["Validation", "1,565 random cells, labelled independently"]];
    steps.forEach((st, i) => {
      const x = 0.4 + i * 3.2;
      s.addText([T(st[0], { bold: true, fontSize: 20, breakLine: true }), T(st[1], { fontSize: 17 })], { x, y: 1.98, w: 2.6, h: 1.3, color: H.text, margin: 0, valign: "middle", isTextBox: true });
      if (i < 3) s.addShape(pres.shapes.LINE, { x: x + 2.66, y: 2.63, w: 0.44, h: 0, line: { color: "404040", width: 4, endArrowType: "triangle" } });
    });
    head(s, "01", "Validation accuracy", 0.45, 3.55, 6.0, H.green, 21);
    table(s, ["Class / measure", "Accuracy"], [
      ["Overall", "89%"],
      ["Commodity-driven deforestation", "94%"],
      ["Urbanization (smallest class)", { text: "55%", options: { bold: true, color: H.red } }],
      ["Forestry, North America (producer's)", "96%"],
      ["Forestry, Southeast Asia (producer's)", { text: "78%", options: { bold: true, color: H.red } }],
    ], { x: 0.45, y: 4.1, w: 6.0, colW: [4.6, 1.4], fs: 16, center: [1] });
    head(s, "02", "Two estimates, one unit", 6.95, 3.55, 6.0, H.green, 21);
    bullets(s, [
      [B("Map-based: "), T("every cell with loss; locates sourcing regions")],
      [B("Sample-based: "), T("1,565 cells; shares ± 95% CI")],
    ], 7.0, 4.1, 6.0, 1.2, 18, 6);
    s.addText([T("Both estimates give each 10 km cell "), B("one dominant driver"), T("; the 95% CI therefore does not cover minority drivers inside a cell.")], { x: 7.0, y: 5.4, w: 6.0, h: 1.4, fontSize: 18, color: H.text, margin: 0, valign: "middle", isTextBox: true });
  }

  // ───────── 5 · Global
  {
    const s = content("Global Drivers, 2001–2015", "About a quarter of forest loss is permanent deforestation",
      "This is the paper's main map. Red is commodity-driven deforestation, yellow shifting agriculture, green forestry, brown wildfire. Forestry and wildfire dominate the temperate and boreal belt: the US Southeast, Canada, Scandinavia, Russia. Deforestation and shifting agriculture dominate the tropics: red across the Brazilian arc and Indonesia and Malaysia, yellow across Central Africa. On the right are the sample-based shares: 27 percent deforestation, 26 forestry, 24 shifting agriculture, 23 wildfire. Converting these shares into areas, about three quarters of the 314 million hectares of loss, roughly 230 million hectares, happened where land use stayed the same.",
      CIT + " Fig. 2; Table 1. *Share × 314 Mha total loss.");
    s.addImage({ path: F + "map.jpg", x: 0.35, y: 1.95, w: 8.6, h: 4.21 });
    s.addImage({ path: F + "f2_legend.png", x: 0.35, y: 6.2, w: 8.6, h: 0.238 });
    caption(s, "Curtis et al. (2018). Figure 2. Primary drivers of forest cover loss, 2001–2015.", 0.35, 6.5, 8.6);
    s.addText("Share of global loss", { x: 9.25, y: 1.95, w: 3.8, h: 0.42, fontSize: 20, bold: true, color: H.green, margin: 0, valign: "middle", isTextBox: true });
    s.addText("Sample-based, ± 95% CI (Table 1)", { x: 9.25, y: 2.37, w: 3.8, h: 0.32, fontSize: 14, italic: true, color: "6E6E6E", margin: 0, valign: "middle", isTextBox: true });
    table(s, ["Driver", "Share"], [
      [{ text: "Deforestation", options: { bold: true } }, { text: "27 ± 5%", options: { bold: true, color: H.red } }],
      ["Forestry", "26 ± 4%"],
      ["Shifting agriculture", "24 ± 3%"],
      ["Wildfire", "23 ± 4%"],
      ["Urbanization", "0.6 ± 0.3%"],
    ], { x: 9.25, y: 2.75, w: 3.8, colW: [2.3, 1.5], fs: 16, center: [1] });
    bullets(s, [
      [G("Temperate & boreal: "), T("forestry, wildfire")],
      [R("Tropics: "), T("deforestation, shifting agriculture")],
      [B("≈ 3/4"), T(" of loss (≈ 230 Mha*) kept its land use")],
    ], 9.25, 5.15, 3.85, 1.85, 16, 3);
  }

  // ───────── 6 · Regional
  {
    const s = content("Regional Contrasts", "Large loss totals do not mean large deforestation",
      "Table 1 splits the loss by region. I multiplied each region's map-based deforestation share by its total loss. Latin America and Southeast Asia hold about 74 of 77 million hectares of mapped deforestation, roughly 96 percent. North America and Russia, China and South Asia account for 43 percent of all loss, 134 million hectares, but only about one million hectares of deforestation: their loss is forestry and wildfire. The rest of the table follows the same logic: Africa is shifting agriculture, Europe is forestry, the boreal and Australian regions are wildfire. This is the misreading the paper warns about: it cites a 2014 headline naming Canada the largest contributor to deforestation.",
      CIT + " Table 1.");
    s.addImage({ path: F + "t1.png", x: 0.35, y: 1.95, w: 8.95, h: 2.97 });
    const k = 8.95 / 2200;
    const hl = (b, col) => s.addShape(pres.shapes.RECTANGLE, { x: 0.35 + b[0] * k, y: 1.95 + b[1] * k, w: (b[2] - b[0]) * k, h: (b[3] - b[1]) * k, fill: { color: "FFFFFF", transparency: 100 }, line: { color: col, width: 1.25 } });
    [[700, 330, 800, 366], [700, 548, 800, 583], [290, 287, 380, 322], [290, 462, 380, 497]].forEach(b => hl(b, H.red));
    caption(s, "Curtis et al. (2018). Table 1. Boxed: loss totals (Mha) and map-based deforestation shares discussed here.", 0.35, 4.97, 8.95);
    bullets(s, [
      [T("Latin America and Southeast Asia hold ≈\u00a074 of ≈\u00a077\u00a0Mha (≈\u00a096%) of mapped deforestation")],
      [T("North America and Russia/China/S. Asia hold 43% of all loss but ≈\u00a01\u00a0Mha of deforestation: their loss is forestry and wildfire")],
      [T("The paper cites a 2014 headline calling Canada the largest contributor to deforestation, a misreading of loss maps")],
    ], 0.45, 5.4, 8.85, 1.6, 16, 4);
    s.addText("Loss vs. deforestation*", { x: 9.6, y: 1.95, w: 3.45, h: 0.4, fontSize: 19, bold: true, color: H.green, margin: 0, valign: "middle", isTextBox: true });
    table(s, ["Region", "Loss", "Defor."], [
      ["Latin America", "78", { text: "43.7", options: { bold: true, color: H.red } }],
      ["North America", "70", "0.7"],
      ["Russia/China/S. Asia", "64", "<0.6"],
      ["Africa", "39", "1.6"],
      ["Southeast Asia", "39", { text: "30.4", options: { bold: true, color: H.red } }],
      ["Europe", "15", "0"],
      ["Australia/Oceania", "10", "0.7"],
      [{ text: "All regions", options: { bold: true } }, { text: "315", options: { bold: true } }, { text: "≈ 77", options: { bold: true } }],
    ], { x: 9.6, y: 2.45, w: 3.45, colW: [1.95, 0.7, 0.8], fs: 15, center: [1, 2] });
    caption(s, "*Mha. Deforestation = map-based deforestation share × regional loss (Table 1); regions sum to 315 Mha by rounding.", 9.6, 5.95, 3.45, 0.95);
  }

  // ───────── 7 · Trend
  {
    const s = content("Deforestation Did Not Decline", "A flat global rate hides a moving frontier",
      "Figure 3A shows commodity-driven deforestation each year: about 5 million hectares, with no downward trend across fifteen years. Fifteen times five gives about 75 million hectares, which matches the 79 to 85 million hectares implied by the attribution shares, so the trend and the map agree. Figure 3B splits the total. Brazil's bars shrink after 2004, while Southeast Asia and other Latin American countries grow. The global total stayed flat because the frontier moved. That pattern is consistent with displacement, although the paper does not test whether Brazil's decline caused the increase elsewhere. The authors conclude that companies would need to remove about 5 million hectares of conversion from their supply chains every year to end deforestation.",
      CIT + " Fig. 3; Table 1. *25–27% × 314 Mha ≈ 79–85 Mha.");
    s.addImage({ path: F + "f3a.png", x: 0.35, y: 1.95, w: 6.15, h: 3.267 });
    s.addImage({ path: F + "f3b.png", x: 6.85, y: 1.95, w: 6.15, h: 3.211 });
    caption(s, "Figure 3A. Annual commodity-driven deforestation, worldwide.", 0.35, 5.27, 6.15);
    caption(s, "Figure 3B. Brazil and the rest of the world.", 6.85, 5.27, 6.15);
    bullets(s, [
      [B("≈ 5 Mha yr⁻¹"), T(" for 15 years, no downward trend")],
      [T("15 × 5 ≈ 75 Mha, matching 25–27% of 314 Mha*")],
      [T("Ending it means removing ≈ 5 Mha of conversion from supply chains "), B("every year")],
    ], 0.45, 5.62, 6.1, 1.42, 17, 3);
    bullets(s, [
      [T("Brazil falls; "), R("Southeast Asia"), T(" and other Latin America rise")],
      [T("Consistent with displacement; causality not tested")],
      [T("A single-country success does not reduce the global total")],
    ], 6.95, 5.62, 6.1, 1.42, 17, 3);
  }

  // ───────── 8 · Trust
  {
    const s = content("Can the Map Be Trusted?", "Map and sample estimates diverge where classes look alike",
      "The paper reports that map-based estimates fall inside the sample confidence intervals for most regions. I checked every cell of Table 1 for the exceptions. The largest is Southeast Asia, shown on the left. The map gives 78 percent deforestation; the sample gives 61 plus or minus 13, so the map is 17 points too high, and shifting agriculture is 11 points too low. Forestry is overstated globally and in Australia. These gaps sit where the paper itself reports visual confusion: plantation harvest in Southeast Asia looks like new oil palm. For regional reporting, the sample numbers are the safer choice. There are also three design limits. The land-use definition counts natural forest replaced by plantation as forestry. One driver per 10-kilometre cell hides minority drivers. And the paper covers direct drivers only, so it cannot say why the frontier moved.",
      CIT + " Fig. 2; Table 1; pp. 1110–1111. Gap = map − sample (percentage points).");
    s.addImage({ path: F + "map_sea.jpg", x: 0.35, y: 1.95, w: 5.2, h: 3.61 });
    caption(s, "Curtis et al. (2018). Figure 2, Southeast Asia (cropped).", 0.35, 5.6, 5.2);
    s.addText([T("Red = commodity-driven deforestation.", { breakLine: true }), T("SE Asia deforestation, map: 78%; sample: 61 ± 13%")], { x: 0.35, y: 5.98, w: 5.3, h: 0.9, fontSize: 17, color: H.text, margin: 0, valign: "top", isTextBox: true });
    head(s, "01", "Map outside the sample 95% CI", 5.95, 1.92, 7.1, H.green, 21);
    table(s, ["Region · driver", "Map", "Sample", "Gap"], [
      [{ text: "SE Asia · deforestation", options: { bold: true } }, "78%", "61 ± 13%", { text: "+17", options: { bold: true, color: H.red } }],
      [{ text: "SE Asia · shifting agriculture", options: { bold: true } }, "9%", "20 ± 10%", { text: "−11", options: { bold: true, color: H.red } }],
      ["Australia/Oceania · forestry", "29%", "19 ± 9%", "+10"],
      ["Global · forestry", "31%", "26 ± 4%", "+5"],
    ], { x: 5.95, y: 2.45, w: 7.05, colW: [3.65, 0.9, 1.5, 1.0], fs: 16, center: [1, 2, 3] });
    head(s, "02", "Design limits", 5.95, 4.6, 7.1, H.green, 21);
    bullets(s, [
      [B("Land-use definition: "), T("forest → plantation counts as forestry")],
      [B("One driver per 10 km cell: "), T("minority drivers disappear")],
      [B("Direct drivers only: "), T("no link to markets or policy")],
    ], 6.0, 5.12, 7.0, 1.85, 18, 5);
  }

  // ───────── 9 · Conclusions (authors')
  {
    const s = content("Conclusions", "The map shows where forest loss is deforestation, and where it is not",
      "To conclude with the authors' own conclusions. First, the global picture: 27 percent of forest loss between 2001 and 2015 was commodity-driven deforestation, and its rate held at about 5 million hectares a year. The authors read this as evidence that zero-deforestation policies are not being adopted or implemented fast enough to meet the 2020 goals; ending deforestation would mean removing about 5 million hectares of conversion from supply chains every year. Second, each driver calls for a different response. Deforestation in Central and South America, Africa and Southeast Asia should be the geographic focus of corporate supply-chain efforts and of international policies such as REDD-plus. Forestry regions supply wood and fibre and are not undergoing deforestation, so the authors argue they should be left out of zero-deforestation monitoring; Figure 2 can serve instead as a sourcing map for certification and traceability. Shifting agriculture matters for forest degradation and for food companies that source from smallholders. Wildfire caused nearly a quarter of loss and is unlikely to be reduced easily by management. Finally, the map gives the more than 2 million users of Global Forest Watch a way to avoid reading every patch of tree cover loss as deforestation. Thank you.",
      CIT + " Abstract; pp. 1110–1111.");
    s.addImage({ path: F + "map.jpg", x: 0.35, y: 1.95, w: 5.9, h: 2.888 });
    s.addImage({ path: F + "f2_legend.png", x: 0.35, y: 4.88, w: 5.9, h: 0.163 });
    caption(s, "Curtis et al. (2018). Figure 2. Primary drivers of forest cover loss, 2001–2015.", 0.35, 5.08, 6.1);
    s.addText([
      T("27 ± 5%", { bold: true }), T(" of 2001–2015 forest loss was commodity-driven deforestation. Its rate stayed near "), T("5 Mha yr⁻¹", { bold: true }),
      T(": pledges are not being implemented at the pace needed for 2020. Ending deforestation means removing about 5 Mha of conversion from supply chains each year."),
    ], { x: 0.35, y: 5.45, w: 6.2, h: 1.5, fontSize: 16, color: H.text, margin: 0, valign: "top", isTextBox: true });
    s.addText("Implications by driver (authors' discussion)", { x: 6.8, y: 1.95, w: 6.25, h: 0.42, fontSize: 19, bold: true, color: H.green, margin: 0, valign: "middle", isTextBox: true });
    table(s, ["Driver", "Implication"], [
      [{ text: "Deforestation", options: { bold: true } }, "Central & South America, Africa and SE Asia should be the focus of supply-chain efforts and REDD+ policies"],
      [{ text: "Forestry", options: { bold: true } }, "Not deforestation; exclude from zero-deforestation monitoring and use Fig. 2 as a wood-fibre sourcing map for certification"],
      [{ text: "Shifting agriculture", options: { bold: true } }, "Signals degradation and risk in smallholder food supply chains (slash-and-burn)"],
      [{ text: "Wildfire", options: { bold: true } }, "Nearly one-quarter of loss; not easily reduced through management"],
    ], { x: 6.8, y: 2.45, w: 6.25, colW: [1.75, 4.5], fs: 16 });
    s.addText("By separating deforestation from temporary loss, the study gives the more than 2 million Global Forest Watch users a way to avoid reading all tree cover loss as deforestation.", { x: 6.8, y: 5.95, w: 6.25, h: 1.05, fontSize: 17, color: H.text, margin: 0, valign: "top", isTextBox: true });
  }

  const out = "./deck.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("written", out);
})();
