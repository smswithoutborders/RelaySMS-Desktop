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
RABBITMQ_PATH="$GATEWAY_CLIENT_PATH/deps/rabbitmq"

# Disable RabbitMQ if it was enabled before uninstalling
disable_rabbitmq() {
    if [ -d "$RABBITMQ_PATH" ]; then
        echo "Disabling RabbitMQ..."
        if [ -x "$RABBITMQ_PATH/builds/sbin/rabbitmqctl" ]; then
            # Disable RabbitMQ management plugin if enabled
            "$RABBITMQ_PATH/builds/sbin/rabbitmq-plugins" disable rabbitmq_management &>/dev/null
            if [ $? -eq 0 ]; then
                echo "RabbitMQ management plugin disabled."
            else
                echo "Failed to disable RabbitMQ management plugin."
            fi
        else
            echo "RabbitMQ path or executable not found. Skipping RabbitMQ disable."
        fi
    else
        echo "RabbitMQ is not installed. Skipping disable."
    fi
}

# Stop the gateway client if it's running
if [ -d "$GATEWAY_CLIENT_PATH" ]; then
    echo "Removing gateway client setup..."
    (cd "$GATEWAY_CLIENT_PATH" && make fuckit) || {
        echo "Error: Failed to stop gateway client."
    }
fi

# Disable RabbitMQ before uninstall
disable_rabbitmq

# Remove the RelaySMS configuration directory
rm -rf "$RELAYSMS_CONFIG_PATH" || {
    echo "Error: Failed to remove RelaySMS config directory."
}

echo "Uninstallation complete."
