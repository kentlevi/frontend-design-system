# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Live Automation Testing

Run Playwright in UI mode with a visible browser:

```bash
npm run test:live
```

What this does:
- Starts the Nuxt app automatically through Playwright `webServer` (default `http://127.0.0.1:4173`)
- Opens Playwright UI so you can run tests interactively
- Runs tests in headed mode so you can watch automation live

Tip:
- Use `npm run test:e2e:ui` if you want the same UI without forcing headed browser windows.

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
