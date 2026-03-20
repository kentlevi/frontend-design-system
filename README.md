# frontend-documentation

Documentation-first guide app for MuSticker's frontend system, including design tokens, reusable UI primitives, guide pages, interaction patterns, and implementation standards for the storefront.

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the local guide app:

```bash
npm run dev
```

## Testing

Run Playwright in UI mode with a visible browser:

```bash
npm run test:live
```

Use `npm run test:e2e:ui` if you want the same UI without forcing headed browser windows.

## Production

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```
