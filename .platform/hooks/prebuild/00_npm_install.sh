#!/bin/bash

# 2. Try to enable Corepack, but don't crash if it fails
if command -v corepack >/dev/null 2>&1; then
    echo "Corepack found. Enabling..."
    corepack enable
    corepack prepare --activate
else
    echo "Corepack not found. Falling back to global npm install..."
    # Install pnpm globally using the pre-installed npm
    npm install -g pnpm
fi

# 3. Verify pnpm is ready
pnpm -v

# 4. Run your optimized install
# Using --unsafe-perm is sometimes necessary for EB root permissions
pnpm install --frozen-lockfile --prod --unsafe-perm