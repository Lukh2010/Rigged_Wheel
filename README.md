# Rigged Lucky Wheel 🎡

You can rig this wheel and have fun with your friends. Perfect for parties and games!

## 🚀 Quick Start (Recommended)

### Windows - One-Click Installer:
```bash
# Just run the installer script - it does everything automatically!
rigged_wheel.bat
```

### Linux/Mac - Docker:
```bash
# One command setup
docker-compose up -d
```

## 🐳 Docker Installation 

### With Docker Compose (easiest):
```bash
docker-compose up -d
```

### With Dockerfile:
```bash
docker build -t rigged-wheel .
docker run -d -p 8000:8000 --name rigged-wheel rigged-wheel
```

## 📦 Manual Installation

### Node.js (Traditional):
```bash
cd rigged_wheel
npm install
npm start
```

### Install Node.js:
- **Windows**: Download from https://nodejs.org
- **Fedora/RHEL**: `sudo dnf install nodejs`
- **Ubuntu/Debian**: `sudo apt install nodejs npm`
- **macOS**: `brew install node`

## 🎮 Usage

- **Main Wheel**: http://localhost:8000
- **Control Panel**: http://localhost:8000/control
- **Keyboard Shortcuts**: Press 'N' for DARK, 'M' for LIGHT

## 🔧 Docker Commands
```bash
# Start in background
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs

# Restart
docker-compose restart

# Update to latest version
docker-compose up -d --build
```

## 🪟 Windows Installer Features

The `install_and_update.bat` script provides:
- ✅ Automatic Docker detection and installation guide
- ✅ One-click installation and updates
- ✅ Automatic cleanup of old files
- ✅ Easy start/stop functionality
- ✅ Git integration for automatic updates

## 🌐 Network Access

The application is also accessible on your local network:
- http://[YOUR-IP]:8000
- Check terminal output for your specific IP address

## 🎯 Rigging Features
- 100% consistent results when rigged
- Control panel for remote rigging
- Keyboard shortcuts for quick rigging
- Spin history tracking
- Beautiful animations and sound effects

---

**Pro Tip**: Use the control panel on your phone while the wheel is displayed on a big screen for the best experience!

