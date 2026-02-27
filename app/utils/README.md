# Utils

- `currency.ts`
  - `formatCurrency(value, options)`: generic currency formatter.
  - `formatCurrencyByCountry(value, country)`: country-aware formatter using `constants/countries`.
  - `formatUsd(value)`: backward-compatible USD formatter.
- `clipboard.ts`
  - `copyTextToClipboard(text)`: browser-only clipboard helper with fallback.
- `color.ts`
  - `isValidHex(value)`: validates hex color values.
  - `getHexFromToken(token)`: resolves CSS variable color token to hex-like string.
- `cart.ts`
  - `sizeDimOnly(label)`: extracts dimension portion from size labels.
- `text.ts`
  - `toGuideLabel(value)`: normalizes short guide labels for display.
