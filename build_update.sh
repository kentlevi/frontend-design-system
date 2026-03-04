#!/bin/bash

# Exit immediately on errors
set -euo pipefail

echo
echo "----------------------------------"
echo "→ Updating build..."
echo "----------------------------------"

# Get the latest Git commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)
CURRENT_BRANCH_TEMP=$(git rev-parse --abbrev-ref HEAD)
# Capitalize the first character
CURRENT_BRANCH="${CURRENT_BRANCH_TEMP^}"
CURRENT_YEAR=$(date +'%Y')
CURRENT_MONTH=$(date +'%m')
CURRENT_DAY=$(date +'%d')
CURRENT_HOUR=$(date +'%H')
CURRENT_MINUTE=$(date +'%M')

# --- Extracting environment variables ---
ENV_FILE=".env"

# Load environment variables from the .env file
if [[ -f "$ENV_FILE" ]]; then
    # Use 'source' to load the variables
    source "$ENV_FILE"
    echo "✔ Loaded environment variables from .env"
else
    echo "----------------------------------"
    echo "❌ .env file not found!!!"
    echo "----------------------------------"
    exit 1
fi

# --- Mandatory Variable Check ---
if [[ -z "$ENV" ]]; then
    echo "----------------------------------"
    echo "❌ Error: The 'ENV' variable is not defined in the .env file."
    echo "----------------------------------"
    exit 2
fi

# Checking allowed environment, only production or development is allowed
if [[ "$ENV" != "production" && "$ENV" != "development" ]]; then
    echo "----------------------------------"
    echo "❌ Invalid environment: '$ENV'. Must be 'production' or 'development'."
    echo "----------------------------------"
    exit 3
fi

# Prevent deploying master branch to any dev/test server
if [[ "$CURRENT_BRANCH" = "Master" && "$ENV" != "production" ]]; then
    echo "----------------------------------"
    echo "❌ Deployment Blocked: Cannot deploy branch master to any development/testing environment."
    echo "----------------------------------"
    exit 4
fi

# Prevent deploying non-master branch to any production server
if [[ "$CURRENT_BRANCH" != "Master" && "$ENV" = "production" ]]; then
    echo "----------------------------------"
    echo "❌ Deployment Blocked: Cannot deploy branch ('$CURRENT_BRANCH') with production environment."
    echo "----------------------------------"
    exit 5
fi


echo "The current environment is: $ENV"
echo
# --- End of Extracting environment variables ---


# Update the version file
echo "$CURRENT_BRANCH" > static/build.txt
echo "Commit: [$COMMIT_HASH]" >> static/build.txt
echo "Build: [$CURRENT_HOUR$CURRENT_MINUTE-$CURRENT_YEAR$CURRENT_MONTH$CURRENT_DAY]" >> static/build.txt

echo "----------------------------------"
echo "✔ Build.txt created successfully."
echo "----------------------------------"
echo
exit 0
