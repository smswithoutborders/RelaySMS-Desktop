#!/bin/bash

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
