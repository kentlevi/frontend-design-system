# app/pages

Nuxt file-based routes. All public docs content lives under [`guide/`](./guide).

## Root

| Path | Purpose |
|---|---|
| [`index.vue`](./index.vue) | Redirect to `/guide`. |
| [`guide.vue`](./guide.vue) | Layout wrapper for the guide tree. Holds `<NuxtPage />`. |

## Guide tree — [`pages/guide/`](./guide)

Adding a new guide? Three steps:
1. Create the `.vue` page here.
2. Add a metadata entry to [`app/data/guide/guides.ts`](../data/guide/guides.ts)
   so it appears in the [`/guide`](./guide/index.vue) index and the
   `quality:guide-docs` script picks it up.
3. If the guide is **stable** (vs `draft`), it must declare `owner`,
   `reviewDueAt`, `qaChecklist`, and `changelog`. The drift check at
   `scripts/check-guide-doc-drift.mjs` enforces this.

### Foundations (design tokens & primitives)

| Page | Topic |
|---|---|
| [`guide/colors.vue`](./guide/colors.vue) | Semantic color tokens. |
| [`guide/color-swatches.vue`](./guide/color-swatches.vue) | Color swatch component variants. |
| [`guide/typography.vue`](./guide/typography.vue) | Font sizes, weights, line heights. |
| [`guide/spacing.vue`](./guide/spacing.vue) | Spacing scale + margin/padding. |
| [`guide/shadows.vue`](./guide/shadows.vue) | Box-shadow utility tokens. |
| [`guide/animation.vue`](./guide/animation.vue) | Motion + transition patterns. |

### UI primitives

| Page | Topic |
|---|---|
| [`guide/buttons.vue`](./guide/buttons.vue) | Variants, tones, sizes, states. |
| [`guide/badges.vue`](./guide/badges.vue) | Badge variants. |
| [`guide/input.vue`](./guide/input.vue) | Text input states + validation. |
| [`guide/form-controls.vue`](./guide/form-controls.vue) | Checkboxes, radios, form-field wrapper. |
| [`guide/icons.vue`](./guide/icons.vue) | Solid / regular / light icons. |
| [`guide/social-icons.vue`](./guide/social-icons.vue) | Social media icon set. |
| [`guide/flags.vue`](./guide/flags.vue) | Country flag display. |
| [`guide/logos.vue`](./guide/logos.vue) | Logo variants. |
| [`guide/skeleton.vue`](./guide/skeleton.vue) | Skeleton loading states. |
| [`guide/tooltip.vue`](./guide/tooltip.vue) | Tooltip behavior + positioning. |
| [`guide/cards.vue`](./guide/cards.vue) | Card layout. |
| [`guide/modals.vue`](./guide/modals.vue) | Modal dialogs + overlays. |
| [`guide/toast.vue`](./guide/toast.vue) | Toast notification patterns. |
| [`guide/carousel.vue`](./guide/carousel.vue) | Image / content carousel. |

### Flow patterns

| Page | Topic |
|---|---|
| [`guide/auth-flow.vue`](./guide/auth-flow.vue) | Login / register / OTP flow. |
| [`guide/cart-patterns.vue`](./guide/cart-patterns.vue) | Cart UI patterns. |
| [`guide/header-patterns.vue`](./guide/header-patterns.vue) | App header patterns. |
| [`guide/product-configurator.vue`](./guide/product-configurator.vue) | Product customization UI. |
| [`guide/feedback-empty-states.vue`](./guide/feedback-empty-states.vue) | Empty / error states. |

### Internationalization

| Page | Topic |
|---|---|
| [`guide/i18n.vue`](./guide/i18n.vue) | i18n setup + usage. |
| [`guide/locale-switcher.vue`](./guide/locale-switcher.vue) | Locale switcher component. |

### Process & governance

| Page | Topic |
|---|---|
| [`guide/onboarding.vue`](./guide/onboarding.vue) | Developer onboarding checklist. Gates access to stable guides. |
| [`guide/standards.vue`](./guide/standards.vue) | Code style + best practices. Read-once consent cookie. |
| [`guide/testing.vue`](./guide/testing.vue) | Testing strategies + patterns. |
| [`guide/coverage.vue`](./guide/coverage.vue) | Test-coverage targets. |
| [`guide/web-vitals.vue`](./guide/web-vitals.vue) | Core Web Vitals dashboard (consumes `plugins/web-vitals.client.ts`). |
| [`guide/tooling.vue`](./guide/tooling.vue) | Out-of-band scripts (workbook sync, media optimization). |
| [`guide/index.vue`](./guide/index.vue) | Guide index / landing. |
