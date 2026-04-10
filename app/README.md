# App Directory Standard

This document defines the expected structure and naming rules for new work in `app/`.
The codebase currently uses `app/stores/` for Pinia stores, so follow that path here unless a broader migration is planned.

## Casing And Naming

- `lower_snake_case` - variables, properties, computed refs, and indexes.
- `camelCase` - functions, methods, and TypeScript classes.
- `PascalCase` - Laravel classes only.
- `kebab-case` - page file names.
- `SCREAMING_SNAKE_CASE` - constant data.

## Folder Layout

```text
app/
├── components/
│   └── order/
│       └── OrderSummary.vue
├── composables/
│   └── order/
│       ├── useOrderModal.ts
│       └── static/
├── services/
│   └── order/
│       ├── order.service.ts
│       └── static/
├── stores/
│   └── order/
│       └── useOrderStore.ts
├── types/
│   └── order/
│       └── index.ts
├── utils/
│   └── order/
│       └── static/
└── pages/
    └── order-history.vue
```

## Folder Rules

### `app/components/`

- UI and user input only.
- No services or stores inside components.
- Components may use composables and utils for formatting, view helpers, and local UI behavior.
- Keep component scripts short. Put behavior in composables when possible.
- Props are for UI and component behavior only.
- Do not pass system or API data through props; use Pinia-backed state instead.

### `app/composables/`

- UI local state and UI logic only.
- Composables may call services and utils.
- Composables do not call stores directly.
- Use `ref()` for local-only UI state.

### `app/services/`

- Business logic and API calls.
- Services act as the bridge between composables, components, stores, types, and utils.
- Services expose reactive store state with `storeToRefs()` when needed.
- Service state and methods should be reusable by multiple composables and components.

### `app/stores/`

- State and getters only.
- No complex business logic in stores.
- Mutations belong in services.

### `app/types/`

- Shared TypeScript types only.

### `app/utils/`

- Global and reusable logic or data only.
- Examples: API initialization, number and currency formatting, image conversion, and system config data.

### `app/pages/`

- Route components only.
- Use `kebab-case` for page file names.

## File And Structure Rules

- Avoid root files inside feature folders.
- Keep composables, services, stores, types, and utils grouped by feature folder, such as `order/`, `cart/`, `user/`, or `profile/`.
- Use `static/` inside a feature folder for mock data, testing helpers, or temporary UI-only logic.
- Composables and stores must use the `use` prefix.
- Service file names must use `<feature>.service.ts`.
- Do not use `useState()` for shared app/system state. Use Pinia for shared state and `ref()` for local-only UI state.
- Keep components and feature files focused so they are easy to remove, migrate, or split later.

## Practical Notes

- Legacy files in the repository may not fully match this standard yet.
- New work should follow this standard, even when old files still use earlier naming patterns.
