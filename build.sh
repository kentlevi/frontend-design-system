#!/bin/bash

# Exit immediately on errors
set -euo pipefail
echo "----------------------------------"
echo "→ Building system..."
echo "----------------------------------"

# If this command fails, 'set -e' will stop the script
bash build_update.sh

# --- Extracting environment variables ---
ENV_FILE=".env"

# Load environment variables from the .env file
source "$ENV_FILE"

# --- Robots.txt modification ---
echo "→ Updating robots.txt..."
if [ "$ENV" = "production" ]; then
    cp robots/production.txt public/robots.txt
else
    cp robots/development.txt public/robots.txt
fi
echo "✔ Updating robots.txt completed."
# --- End of robots.txt modification ---


FIRST_ARG="${1:-}"

if [ "$FIRST_ARG" = "i" ]; then
    echo "----------------------------------"
    echo "→ Installing dependencies..."
    echo "----------------------------------"
    pnpm install
    echo "----------------------------------"
    echo "✔ Dependencies installed."
    echo "----------------------------------"
    echo
fi

# --- Nuxt building codes ---
echo "→ Compiling files..."
# If this command fails, 'set -e' will stop the script
pnpm run self-build
echo "----------------------------------"
echo "✔ System built."
echo "----------------------------------"
echo
# --- End of Nuxt building codes ---
exit 0
