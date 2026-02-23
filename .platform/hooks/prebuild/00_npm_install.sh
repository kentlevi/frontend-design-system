#!/bin/bash

# 1. Enable Corepack (built-in to Node)
corepack enable

# 2. Tell Corepack to prepare pnpm (it looks at your packageManager field in package.json)
corepack prepare pnpm@latest --activate

# 3. Verify installation
pnpm -v

# 4. Run your optimized install
# Note: EB sets the directory to /var/app/staging during this hook
pnpm install --frozen-lockfile --prod