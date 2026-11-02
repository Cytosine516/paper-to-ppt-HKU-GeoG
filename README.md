# paper-to-ppt (HKU Geography style)

A Claude skill that turns an academic paper (PDF) into an English paper-presentation deck (.pptx) in the HKU Department of Geography style.

- The paper's own figures are the visual centre of each slide.
- Tables are plain academic three-line tables.
- No icon cards, colour blocks or bottom takeaway lines.
- The final slide is built on the authors' own conclusions.

## Contents

```
paper-to-ppt/
├── SKILL.md                                # instructions Claude follows
├── scripts/fixppr.py                       # fixes duplicate paragraph properties written by pptxgenjs
└── assets/
    ├── paper-to-ppt-template-v5.pptx       # approved reference deck (Curtis et al., 2018, Science)
    ├── paper-to-ppt-template-v5.pdf        # the same deck as page images
    └── example-build-curtis2018.js         # pptxgenjs script that built the template
```

## Install

- **claude.ai:** zip the `paper-to-ppt/` folder and upload it under **Customize > Skills**. Code execution must be on in **Settings > Capabilities**.
- **Claude Code:** copy `paper-to-ppt/` into `~/.claude/skills/`.

## Use

Upload a paper PDF and ask, for example: "用 paper-to-ppt 根据这篇论文做PPT". Claude first confirms the slide count, cover and transition slides. Then it builds the deck, renders every slide to check it, and returns the .pptx file.

## Notes

The template's content (text, figures, numbers) comes from Curtis, P. G. et al. (2018). Classifying drivers of global forest loss. *Science*, 361, 1108–1111. It is there only to show layout. The HKU and Department of Geography logos belong to the University of Hong Kong.
