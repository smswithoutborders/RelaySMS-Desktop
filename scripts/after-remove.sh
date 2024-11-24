#!/bin/bash

# Delete the link to the binary
if type update-alternatives >/dev/null 2>&1; then
    update-alternatives --remove 'relaysms' '/usr/bin/relaysms'
else
    rm -f '/usr/bin/relaysms'
fi

USER_HOME=$(getent passwd "$SUDO_USER" | cut -d: -f6)
RELAYSMS_CONFIG_PATH="$USER_HOME/.config/relaysms"
GATEWAY_CLIENT_PATH="$USER_HOME/.config/relaysms/RelaySMS-GatewayClient-Linux"

if [ -d "$GATEWAY_CLIENT_PATH" ]; then
    echo "Removing gateway client setup..."
    (cd "$GATEWAY_CLIENT_PATH" && make fuckit) || {
        echo "Error: Failed to stop gateway client."
    }
fi

rm -rf "$RELAYSMS_CONFIG_PATH"
