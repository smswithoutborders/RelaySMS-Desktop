#!/bin/bash

USER_HOME=$(getent passwd "$SUDO_USER" | cut -d: -f6)
PDR_CLI_PATH="$USER_HOME/.config/relaysms/py_double_ratchet_cli"
PDR_CLI_URL="https://github.com/smswithoutborders/py_double_ratchet_cli/archive/refs/heads/main.tar.gz"
GATEWAY_CLIENT_PATH="$USER_HOME/.config/relaysms/RelaySMS-GatewayClient-Linux"
GATEWAY_CLIENT_URL="https://github.com/smswithoutborders/RelaySMS-GatewayClient-Linux/archive/refs/heads/master.tar.gz"
RABBITMQ_PATH="$GATEWAY_CLIENT_PATH/deps/rabbitmq"

# Color settings for loader
SUCCESS_COLOR="\033[0;32m"
FAILURE_COLOR="\033[0;31m"
INFO_COLOR="\033[1;36m"
RESET_COLOR="\033[0m"

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

# Check for Python installation
if ! command -v python3 &>/dev/null; then
    echo "Error: Python is required but not installed. Please install Python 3 to continue."
    exit 1
fi

# loader function
show_loader() {
    local PID=$1
    local MSG=$2
    local SPINNER="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
    local i=0

    printf "${INFO_COLOR}$MSG... ${RESET_COLOR}"
    while kill -0 $PID 2>/dev/null; do
        printf "\r${INFO_COLOR}$MSG... [${SPINNER:i++%${#SPINNER}:1}]${RESET_COLOR} "
        sleep 0.1
    done

    wait $PID
    local STATUS=$?
    if [ $STATUS -eq 0 ]; then
        printf "\r${SUCCESS_COLOR}$MSG... done!${RESET_COLOR}\n"
    else
        printf "\r${FAILURE_COLOR}$MSG... failed!${RESET_COLOR}\n"
        exit $STATUS
    fi
}

# Function to download and extract files
download_and_extract() {
    local url=$1
    local dest=$2
    local task_desc=$3

    sudo -u "$SUDO_USER" mkdir -p "$dest"
    { curl -SL "$url" 2>/dev/null | sudo -u "$SUDO_USER" tar -xz -C "$dest" --strip-components=1; } &>/dev/null &
    show_loader $! "Downloading and extracting $task_desc"
}

# Setup Python CLI
setup_python_cli() {
    download_and_extract "$PDR_CLI_URL" "$PDR_CLI_PATH" "py_double_ratchet_cli setup"

    sudo -u "$SUDO_USER" python3 -m venv "$PDR_CLI_PATH/venv" &>/dev/null & 
    show_loader $! "Creating virtual environment for py_double_ratchet_cli"

    sudo -u "$SUDO_USER" "$PDR_CLI_PATH/venv/bin/pip" install -U pip setuptools &>/dev/null & 
    show_loader $! "Upgrading pip and setuptools"

    sudo -u "$SUDO_USER" "$PDR_CLI_PATH/venv/bin/pip" install -r "$PDR_CLI_PATH/requirements.txt" &>/dev/null & 
    show_loader $! "Installing cli dependencies (this might take while)"
}

# Setup Gateway Client
setup_gateway_client() {
    download_and_extract "$GATEWAY_CLIENT_URL" "$GATEWAY_CLIENT_PATH" "RelaySMS Gateway Client setup"

    cd "$GATEWAY_CLIENT_PATH" || exit
    make &>/dev/null & 
    show_loader $! "Building Gateway Client"

    make install &>/dev/null & 
    show_loader $! "Installing Gateway Client (this might take while)"

    make start &>/dev/null & 
    show_loader $! "Starting Gateway Client"

    make enable &>/dev/null & 
    show_loader $! "Enabling Gateway Client"
}

# Check if RabbitMQ is installed and running as a systemd service
is_rabbitmq_running() {
    if systemctl is-active --quiet rabbitmq-server; then
        return 0
    else
        return 1
    fi
}

# Setup rabbitmq
setup_rabbitmq() {    
    cd "$RABBITMQ_PATH" || exit

    sudo -u "$SUDO_USER" mkdir -p "$RABBITMQ_PATH/builds"
    sudo -u "$SUDO_USER" tar -xJf "$RABBITMQ_PATH/rabbitmq-server-generic-unix-3.9.9.tar.xz" -C "$RABBITMQ_PATH/builds"  --strip-components=1 &>/dev/null & 
    show_loader $! "Extracting rabbitmq components"

    .$RABBITMQ_PATH/builds/sbin/rabbitmq-plugins enable rabbitmq_management &>/dev/null & 
    show_loader $! "Setting up rabbitmq"
}

if [ ! -d "$PDR_CLI_PATH" ]; then
    setup_python_cli || exit 1
else
    echo "py_double_ratchet_cli already exists. Skipping setup."
fi

if [ ! -d "$GATEWAY_CLIENT_PATH" ]; then
    setup_gateway_client || exit 1
else
    echo "RelaySMS Gateway Client already exists. Skipping setup."
fi

if is_rabbitmq_running; then
    setup_rabbitmq || exit 1
else
    echo "RabbitMQ is running. Skipping setup."
fi