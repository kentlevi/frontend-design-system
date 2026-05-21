# app/middleware

Nuxt route middleware for the documentation site. Global middleware runs on
every navigation; the filename prefix controls order.

## Files

- **`00-guide-only.global.ts`** — first to run. Redirects any non-`/guide`
  route into the guide tree so the docs site stays a single-purpose surface.
- **`guide-onboarding.global.ts`** — guards stable guides behind the
  developer onboarding flow. Checks a `guide_standards_read_v<n>` cookie
  (version-pinned via `GUIDE_ONBOARDING_VERSION` in
  `app/constants/guide-onboarding.ts`); if absent, redirects to
  `/guide/onboarding` with the original target preserved as `?redirect=`.

## Conventions

- Use the `.global.ts` suffix only when the middleware **must** run on every
  route. Otherwise, name it `<feature>.ts` and reference it via
  `definePageMeta({ middleware: 'feature' })` on the pages that need it.
- The numeric prefix (`00-`, `10-`, …) orders global middleware deterministically.
  Reserve `00-` for "before anything else"-type gates.
- Server- vs client-only logic is gated with `import.meta.server`/`.client`,
  not by file suffix (`.global.server.ts` / `.global.client.ts`) — keeps the
  call surface uniform.
