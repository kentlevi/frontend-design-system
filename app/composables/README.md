# app/composables

Vue 3 composables used by the docs site. Auto-imported from `composables/`,
`composables/core/`, and `composables/ui/` (see `nuxt.config.ts`).

## Layout

- **`app/`** — application bootstrap composables (`useAppInit`),
  country/locale routing (`useCountry`, `usePageRedirect`).
- **`core/`** — cross-cutting utilities; currently the file-base-URL resolver
  (`useFileBaseUrl`) used by media references.
- **`guide/`** — composables that power the design-system guide pages:
  index/listing, demo builders (buttons, badges, colors, logos, icons), media
  size helpers, search.
- **`ui/`** — shared UI behavior (`useTooltip`).

## Conventions

- Files are named `use<Thing>.ts` and export a function of the same name.
- Inputs are typed; no `any`. Reactive state stays inside the composable —
  return refs or computed-only.
- Side effects that touch `window` / `document` are guarded with
  `import.meta.client` so the composable is safe during SSR.

When mirroring a composable from the storefront for documentation purposes,
prefix or alias it so it's clear the version under `frontend-documentation/`
is the **demonstration copy**, not the production one — the storefront repo
remains the source of truth for runtime behavior.
