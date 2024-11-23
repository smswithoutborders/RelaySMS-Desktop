#!/bin/bash

GATEWAY_CLIENTS_URL="https://gatewayserver.smswithoutborders.com/v3/clients"
OUTPUT_DIR="../public"
OUTPUT_FILE="gateway_clients.json"

echo "Downloading gateway clients from $GATEWAY_CLIENTS_URL..."
curl -L "$GATEWAY_CLIENTS_URL" -o "$OUTPUT_DIR/$OUTPUT_FILE" 

if [[ $? -eq 0 ]]; then
  echo "Gateway clients successfully downloaded to $OUTPUT_DIR/$OUTPUT_FILE"
else
  echo "Failed to download gateway clients."
fi
