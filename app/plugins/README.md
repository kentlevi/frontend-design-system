# app/plugins

Nuxt plugins for the documentation site.

## Files

- **`web-vitals.client.ts`** — client-only Core Web Vitals collector. Hooks
  into `web-vitals` to capture LCP / INP / CLS / FID / TTFB for the routes
  the guide site renders, tags samples with route + nav type, and beacons
  them to the endpoint defined in `runtimeConfig.public.webVitalsEndpoint`
  (`/api/web-vitals` by default). The data feeds the
  [`/guide/web-vitals`](../pages/guide/web-vitals.vue) dashboard.

## Conventions

- Use the `.client.ts` / `.server.ts` suffix to scope a plugin, not
  `if (import.meta.client)` inside a universal plugin — the build picks the
  right side and trims dead code.
- Keep plugins narrow: one responsibility per file. The runtime cost adds
  up; each plugin runs on every page boot.
- Provide injections under a stable name (`provide: { foo }` → `$foo`) and
  document the contract in this README when adding a new plugin.
