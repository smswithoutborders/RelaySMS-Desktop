# Setting Up Gateway Clients

This guide explains the steps needed to set up the gateway client for Ubuntu and Arch Linux.

## Step 1: Install Dependencies

Select your operating system and install the required dependencies.

### Ubuntu

```bash
sudo apt install build-essential libpython3-dev libdbus-1-dev
sudo apt install python3-gi python3-gi-cairo gir1.2-gtk-3.0
sudo apt install libgirepository1.0-dev gcc libcairo2-dev pkg-config python3-dev python3-venv
```

### Arch

```bash
sudo pacman -S python-gobject gtk3
sudo pacman -S python cairo pkgconf gobject-introspection gtk3
```

## Step 2: Clone the Repository and Start

```bash
git clone git@github.com:smswithoutborders/SMSWithoutBorders-Gateway-Client.git
```

```bash
cd SMSWithoutBorders-Gateway-Client
```

```bash
make
```

```bash
make start
```

## Step 3: Plug in Your Modem

Ensure your modem is connected and recognized by the system.

## Step 4: Publish Messages

Once set up, you can now publish messages through the gateway client.

#### Erros to lookout for

- No active modems found
  TThe system cannot locate or read your modem. Ensure the modem is properly plugged in, with a functional SIM card installed.

- Please select a Gateway Client
  You must select a number to route messages through. Go to the cell tower icon in the app and choose a gateway client (number) near your location to reduce SMS costs.

- error 500
  This is a general error. Try sending the message again, and it should resolve itself.
