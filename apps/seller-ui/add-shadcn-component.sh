#!/bin/bash

# Script to add shadcn/ui components to the seller-ui app in Nx monorepo
# Usage: ./add-shadcn-component.sh <component-name>
# Example: ./add-shadcn-component.sh badge

if [ $# -eq 0 ]; then
    echo "Usage: $0 <component-name>"
    echo "Example: $0 badge"
    exit 1
fi

COMPONENT_NAME=$1
CURRENT_DIR=$(pwd)
MONOREPO_ROOT="../../"
WRONG_PATH_RELATIVE="../../src/components/ui"
WRONG_PATH_ABSOLUTE="/media/gm-hridoy/programming/hamsoya-monorepo/src/components/ui"
CORRECT_PATH="src/components/ui"

echo "🚀 Adding shadcn/ui component: $COMPONENT_NAME"
echo "📁 Current directory: $CURRENT_DIR"

# Method 1: Use shadcn CLI and then move the file to correct location
echo "📦 Running shadcn CLI..."
cd "$MONOREPO_ROOT"

if npx shadcn@latest add $COMPONENT_NAME --cwd apps/seller-ui --yes; then
    cd "$CURRENT_DIR"

    # Check if component was created in wrong location and move it
    if [ -f "$WRONG_PATH_RELATIVE/${COMPONENT_NAME}.tsx" ]; then
        echo "📁 Moving component from wrong location (relative path)..."
        mv "$WRONG_PATH_RELATIVE/${COMPONENT_NAME}.tsx" "$CORRECT_PATH/${COMPONENT_NAME}.tsx"
        echo "✅ Component $COMPONENT_NAME moved to correct location: $CORRECT_PATH/${COMPONENT_NAME}.tsx"
    elif [ -f "$WRONG_PATH_ABSOLUTE/${COMPONENT_NAME}.tsx" ]; then
        echo "📁 Moving component from wrong location (absolute path)..."
        mv "$WRONG_PATH_ABSOLUTE/${COMPONENT_NAME}.tsx" "$CORRECT_PATH/${COMPONENT_NAME}.tsx"
        echo "✅ Component $COMPONENT_NAME moved to correct location: $CORRECT_PATH/${COMPONENT_NAME}.tsx"
    elif [ -f "$CORRECT_PATH/${COMPONENT_NAME}.tsx" ]; then
        echo "✅ Component $COMPONENT_NAME already in correct location: $CORRECT_PATH/${COMPONENT_NAME}.tsx"
    else
        echo "⚠️  Component file not found in expected locations, checking manually..."
        find "$MONOREPO_ROOT" -name "${COMPONENT_NAME}.tsx" -type f 2>/dev/null | head -5
    fi

    echo "🎉 Component $COMPONENT_NAME added successfully!"
    exit 0
else
    echo "❌ shadcn CLI failed, falling back to manual download..."
    cd "$CURRENT_DIR"
fi

# Method 2: Fallback to manual download
COMPONENT_URL="https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/registry/new-york/ui/${COMPONENT_NAME}.tsx"
OUTPUT_PATH="$CORRECT_PATH/${COMPONENT_NAME}.tsx"

echo "🌐 Downloading ${COMPONENT_NAME} component from registry..."
curl -s "$COMPONENT_URL" -o "$OUTPUT_PATH"

if [ $? -eq 0 ] && [ -s "$OUTPUT_PATH" ]; then
    echo "✅ Component ${COMPONENT_NAME} successfully downloaded to ${OUTPUT_PATH}"
    echo "📦 Don't forget to install any required dependencies!"
    echo "🔍 Check the component file for any dependencies that need to be installed."
else
    echo "❌ Failed to download component ${COMPONENT_NAME}"
    echo "🌐 Check if the component exists at: $COMPONENT_URL"
    rm -f "$OUTPUT_PATH" 2>/dev/null
    exit 1
fi
