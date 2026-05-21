# Media Optimization

Two scripts for keeping the storefront's media weight under control:

| Script | Use when |
|---|---|
| [`optimize-media.ps1`](./optimize-media.ps1) | A raw image/video upload landed in `tmp/` or was added to the product hero/feature directories and looks oversized (multi-MB MP4, 1080p60 with audio, big PNG). |
| [`font-subset.ps1`](./font-subset.ps1) | A new variable font is being added to the project, or the existing one is shipping the full glyph set as a single file. |

Both write to a destination you choose; neither touches files in place.

## Prerequisites

- **`optimize-media.ps1`** needs [ffmpeg](https://ffmpeg.org/) on `PATH` (or
  pass `-Ffmpeg <full-path>`). On Windows we usually install via WinGet
  (`winget install Gyan.FFmpeg`) which puts it under
  `%LOCALAPPDATA%\Microsoft\WinGet\Packages\…\bin\ffmpeg.exe`.
- **`font-subset.ps1`** needs Python 3.10+ on `PATH`. The script creates its
  own venv next to itself (`.fontwork-venv/`) and `pip install`s
  `fonttools` + `brotli` automatically.

## `optimize-media.ps1` — image and video batch

```powershell
.\optimize-media.ps1 -SrcRoot "C:\tmp\raw-products" `
                     -DstRoot "C:\tmp\optimized-products"
```

Walks `-SrcRoot`, mirrors its directory tree under `-DstRoot`, and:

- **PNG → WebP** at `libwebp -quality 82 -preset photo`. Typical reduction
  90-95%.
- **MP4 → MP4** at `libx264 -profile:v high -preset medium -crf 26
  -maxrate 1800k`, scaled down to fit 1080p, fps capped at 30, audio stripped,
  `+faststart` so the moov atom sits at the front for instant playback.
  Typical reduction on unoptimized 1080p60 source: 80-90%.
- **WebP** files are copied through unchanged — so the mirrored output is a
  drop-in replacement you can upload wholesale to the CDN.

The script is **idempotent** — files already present in `-DstRoot` are
skipped, so you can resume after an interruption.

### When NOT to use it

If a file is **already small at the source** — i.e. someone in the team
exported it well — re-encoding will *increase* size because CRF 26 targets
higher quality than the source. Smell test: anything < 1 MB / 540p-720p /
no audio is almost certainly already optimized.

Inspect with `ffprobe` first:

```powershell
ffprobe -v error `
        -select_streams v:0 `
        -show_entries stream=width,height,r_frame_rate,bit_rate,codec_name `
        -show_entries format=duration,size,bit_rate `
        -of default=noprint_wrappers=1 `
        path\to\video.mp4
```

A real example from this project — out of 27 product hero videos:

- One outlier was **1920×1080 @ 60 fps, 10 Mbps, with audio, 46 MB**.
  Optimized → 8 MB (82.6% smaller).
- The other 26 were already **540p-720p @ 24-30 fps, ~300-630 kbps, no audio,
  ~950 KB each**. Optimizing those produced *larger* output. Originals kept.

### Tuning

`-Crf`, `-MaxRate`, `-WebpQuality` are exposed as parameters. Bump `-Crf` to
28-30 for marketing videos where slight artifacting is acceptable; drop to
22-24 for hero loops you want crisp.

## `font-subset.ps1` — split a variable font by unicode range

```powershell
.\font-subset.ps1 -Source "C:\path\to\PretendardVariable.ttf" `
                  -OutDir  "C:\path\to\frontend\public\fonts"
```

Produces two WOFF2 files next to each other:

- `PretendardVariable.latin.woff2` — Basic Latin, Latin-1, Latin Extended-A,
  General Punctuation, Currency, Letterlike, Math, Geometric Shapes. ~80 KB
  for Pretendard variable.
- `PretendardVariable.kr.woff2` — Hangul Jamo, Hangul Syllables, Hangul
  Compatibility Jamo, Hangul Jamo Extended A/B, CJK Symbols & Punctuation,
  Halfwidth/Fullwidth. ~1.7 MB for Pretendard variable.

The variable weight axis is preserved in both — you still get the full
`font-weight: 100 900` range.

### Hooking it up to the storefront

After running the script, swap the existing `@font-face` block in
`frontend/app/assets/scss/base/_globals.scss` (or wherever you declare the
font) for two range-scoped blocks:

```scss
@font-face {
    font-family: 'Pretendard';
    src: url('/fonts/PretendardVariable.latin.woff2') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0020-007F, U+00A0-00FF, U+0100-017F, U+2000-206F,
                   U+2070-209F, U+20A0-20CF, U+2100-214F, U+2150-218F,
                   U+2190-21FF, U+2200-22FF, U+25A0-25FF;
}
@font-face {
    font-family: 'Pretendard';
    src: url('/fonts/PretendardVariable.kr.woff2') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
    unicode-range: U+1100-11FF, U+3000-303F, U+3130-318F, U+A960-A97F,
                   U+AC00-D7AF, U+D7B0-D7FF, U+FF00-FFEF;
}
```

Then in `nuxt.config.ts`, preload the Latin subset (small, used on every
page for digits, currency, brand names):

```ts
app: {
  head: {
    link: [
      {
        rel: 'preload',
        href: '/fonts/PretendardVariable.latin.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    ],
  },
},
```

For KR-locale routes specifically, also preload the Korean subset from the
page-level `useHead` (gated on `route.params.country === 'kr'`). The
Pretendard KR file is large enough (~1.7 MB) that you don't want to preload
it on `/us` routes that won't render any Hangul.

### Real-world result on this project

Original `PretendardVariable.ttf`: **6,581 KB**, served as one file to every
visitor.

After subsetting:

- EN visitors: download **79 KB** Latin subset only — **98.8% smaller**.
- KR visitors: download Latin (79 KB) + Korean (1,701 KB) = **1,780 KB**
  total — **73% smaller**.

The Korean subset is fetched lazily by the browser via `unicode-range`
discovery once it encounters a Hangul glyph in the rendered text.
