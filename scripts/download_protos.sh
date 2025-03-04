#!/bin/bash

declare -A URLS=(
  ["https://raw.githubusercontent.com/smswithoutborders/RelaySMS-Vault/main/protos/v1/vault.proto"]="protos/v1/vault.proto"
)

DEST_DIR="../"

for URL in "${!URLS[@]}"; do
  DEST_PATH="${DEST_DIR}/${URLS[$URL]}" 
  mkdir -p "$(dirname "$DEST_PATH")"   
  curl -L "$URL" -o "$DEST_PATH"      
  echo "Downloaded $URL to $DEST_PATH"
done
