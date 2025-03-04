#!/bin/bash

# Delete the link to the binary
if type update-alternatives >/dev/null 2>&1; then
    update-alternatives --remove 'relaysms' '/usr/bin/relaysms'
else
    rm -f '/usr/bin/relaysms'
fi

USER_HOME=$(getent passwd "$SUDO_USER" | cut -d: -f6)
RELAYSMS_CONFIG_PATH="$USER_HOME/.config/relaysms"

# Remove the RelaySMS configuration directory
rm -rf "$RELAYSMS_CONFIG_PATH" || {
    echo "Error: Failed to remove RelaySMS config directory."
}

echo "Uninstallation complete."
