#!/bin/bash

if type update-alternatives 2>/dev/null >&1; then
    # Remove previous link if it doesn't use update-alternatives
    if [ -L '/usr/bin/relaysms' -a -e '/usr/bin/relaysms' -a "$(readlink '/usr/bin/relaysms')" != '/etc/alternatives/relaysms' ]; then
        rm -f '/usr/bin/relaysms'
    fi
    update-alternatives --install '/usr/bin/relaysms' 'relaysms' '/opt/RelaySMS/relaysms' 100 || ln -sf '/opt/RelaySMS/relaysms' '/usr/bin/relaysms'
else
    ln -sf '/opt/RelaySMS/relaysms' '/usr/bin/relaysms'
fi

# SUID chrome-sandbox for Electron 5+
chmod 4755 '/opt/RelaySMS/chrome-sandbox' || true

if hash update-mime-database 2>/dev/null; then
    update-mime-database /usr/share/mime || true
fi

if hash update-desktop-database 2>/dev/null; then
    update-desktop-database /usr/share/applications || true
fi

if ! command -v python3 >/dev/null 2>&1; then
    echo "Error: Python is required and not installed. Please install Python to continue."
    exit 1
fi

USER_HOME=$(getent passwd "$SUDO_USER" | cut -d: -f6)
PDR_CLI_PATH="$USER_HOME/.local/share/relaysms/py_double_ratchet_cli"
PDR_CLI_URL="https://github.com/smswithoutborders/py_double_ratchet_cli.git"

if [ ! -d "$PDR_CLI_PATH" ]; then
    echo "Creating directory $PDR_CLI_PATH..."
    sudo -u "$SUDO_USER" mkdir -p "$PDR_CLI_PATH"
    chown "$SUDO_USER":"$SUDO_USER" "$PDR_CLI_PATH"

    echo "Cloning py_double_ratchet_cli to $PDR_CLI_PATH..."
    sudo -u "$SUDO_USER" git clone "$PDR_CLI_URL" "$PDR_CLI_PATH" || {
        echo "Error: Failed to clone repository."
        exit 1
    }

    echo "Creating virtual environment..."
    sudo -u "$SUDO_USER" python3 -m venv "$PDR_CLI_PATH/venv" || {
        echo "Error: Failed to create virtual environment."
        exit 1
    }

    echo "Installing dependencies..."
    sudo -u "$SUDO_USER" "$PDR_CLI_PATH/venv/bin/pip" install -U pip setuptools || {
        echo "Error: Failed to upgrade pip and setuptools."
        exit 1
    }
    sudo -u "$SUDO_USER" "$PDR_CLI_PATH/venv/bin/pip" install -r "$PDR_CLI_PATH/requirements.txt" || {
        echo "Error: Failed to install dependencies."
        exit 1
    }

    echo "Setup complete."
else
    echo "py_double_ratchet_cli already exists. Skipping setup."
fi
