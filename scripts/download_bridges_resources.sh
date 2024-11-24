#!/bin/bash

REPO="smswithoutborders/RelaySMS-Bridge-Server"
BRANCH="main"
TARGET_DIR="../public/bridges_resources" 
ZIP_URL="https://github.com/$REPO/archive/$BRANCH.zip"

TEMP_ZIP="/tmp/RelaySMS-Bridge-Server-$BRANCH.zip"
EXTRACT_DIR="/tmp/RelaySMS-Bridge-Server-$BRANCH"

echo "Downloading resources folder from $REPO..."
curl -L "$ZIP_URL" -o "$TEMP_ZIP"

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

unzip "$TEMP_ZIP" -d "$EXTRACT_DIR"

mv "$EXTRACT_DIR/RelaySMS-Bridge-Server-$BRANCH/resources"/* "$TARGET_DIR/"

rm -rf "$TEMP_ZIP" "$EXTRACT_DIR"

echo "Download complete. Resources saved to $TARGET_DIR"
