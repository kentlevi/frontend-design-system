# app/stores

Pinia stores for the documentation site.

**Currently empty.** The guide app is intentionally stateless at the page
level — each guide page reads from static data (`app/data/`) and local
component state. The only persisted bit of state lives in cookies (the
onboarding-read flag in `app/middleware/guide-onboarding.global.ts`), not in
a store.

If a future guide needs cross-page state (multi-step builder, shared
playground configuration, etc.), prefer a Pinia store here over Vue's
`provide`/`inject` so the state survives navigation between sibling guide
pages.

## Conventions when adding a store

- One file per store, named `<feature>.store.ts`.
- Use the composition API form: `defineStore('feature', () => { ... })`.
- Initialize all reactive state at the top. Return only what callers need —
  don't auto-export every internal ref.
- Document the store's purpose in this README when adding.
