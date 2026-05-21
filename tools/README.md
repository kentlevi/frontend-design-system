# Frontend Tooling

Out-of-band scripts used periodically by the team. Not part of the build —
these are run manually when their respective workflow comes up.

## [`workbook/`](./workbook) — Content Workbook sync

Extract a new revision of the Musticker Content Workbook (Google Sheets →
`.xlsx`), diff it against the storefront's i18n locale files, review the
resulting plan, and apply approved changes.

Run when: a content/copy update lands in the workbook and needs to roll out
to `frontend/i18n/locales/{en,kr}/**`.

See [`workbook/README.md`](./workbook/README.md) for the three-step pipeline.

## [`media/`](./media) — Image and font optimization

- **`optimize-media.ps1`** — batch convert raw PNGs to WebP and re-encode
  oversized MP4s for the web (no audio, capped at 1080p/30 fps,
  `+faststart`). Use on raw camera/editor exports before uploading to the
  product CDN.
- **`font-subset.ps1`** — split a variable TTF font into Latin + Korean
  WOFF2 subsets so EN visitors don't download Hangul glyphs and vice versa.
  One-time setup per font.

Run when: a raw media asset is being prepared for upload, or a new variable
font is added to the project.

See [`media/README.md`](./media/README.md) for prerequisites, parameters,
and SCSS hookup examples.
