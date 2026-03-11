# Rigged Lucky Wheel 🎡

You can rig this wheel and have fun with your friends. Perfect for parties and games!

## 🚀 Complete Installation Guide

### Windows Installation

#### Option 1: One-Click Installer (Recommended for Beginners)
```bash
# Just double-click the installer script
rigged_wheel.bat
```

The installer will:
- ✅ Check if Docker is installed
- ✅ Guide you through Docker installation if needed
- ✅ Automatically build and start the application
- ✅ Show you the access URLs

#### Option 2: Manual Docker Installation
1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop
2. **Open Command Prompt** in the project folder
3. **Run**: `docker-compose up -d`
4. **Access**: http://localhost:8000

#### Option 3: Manual Node.js Installation
1. **Install Node.js**: https://nodejs.org
2. **Open Command Prompt** in the `rigged_wheel` folder
3. **Run**: `npm install`
4. **Run**: `npm start`
5. **Access**: http://localhost:8000

### Linux Installation

#### Option 1: Docker (Recommended)
```bash
# Install Docker
sudo apt update
sudo apt install docker.io docker-compose

# Add user to docker group (optional)
sudo usermod -aG docker $USER

# Start the application
docker-compose up -d
```

#### Option 2: Manual Node.js Installation
```bash
# Install Node.js
sudo apt update
sudo apt install nodejs npm

# Navigate to application folder
cd rigged_wheel

# Install dependencies
npm install

# Start the server
npm start
```

## 📋 System Requirements

### For Docker Installation:
- **Windows**: Windows 10/11 with Docker Desktop
- **Linux**: Any distribution with Docker support
- **Mac**: macOS with Docker Desktop
- **RAM**: Minimum 4GB recommended

### For Manual Installation:
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **RAM**: Minimum 2GB recommended

## 🎮 How to Use

Once installed, access:
- **Main Wheel**: http://localhost:8000
- **Control Panel**: http://localhost:8000/control

### Keyboard Shortcuts:
- **N**: Force next spin to be DARK
- **M**: Force next spin to be LIGHT

### Control Panel Features:
- Set next spin outcome remotely
- View spin history
- Dark/Light theme toggle
- Sound effects toggle

## 🛠️ Application Features

- ✅ 100% consistent rigging results
- ✅ Remote control panel
- ✅ Keyboard shortcuts for quick control
- ✅ Spin history tracking (last 5 spins)
- ✅ Beautiful animations with smooth transitions
- ✅ Realistic sound effects
- ✅ Dark/Light theme support
- ✅ Sound on/off toggle
- ✅ Mobile-responsive design
- ✅ Network accessibility

## 🔧 Docker Management

```bash
# Start application (background)
docker-compose up -d

# Stop application
docker-compose down

# View application logs
docker-compose logs

# Restart application
docker-compose restart

# Update to latest version
docker-compose up -d --build

# Check container status
docker-compose ps
```

## 🌐 Network Access

The application is accessible on your local network:
- **Main URL**: http://localhost:8000
- **Network URL**: http://[YOUR-IP]:8000
- **Control Panel**: http://localhost:8000/control

To find your IP address:
- **Windows**: Run `ipconfig` in Command Prompt
- **Linux/Mac**: Run `hostname -I` in Terminal

## 🪟 Windows Installer Details

The `rigged_wheel.bat` script provides:
- ✅ Automatic Docker installation check
- ✅ Guided Docker setup if not installed
- ✅ One-click application startup
- ✅ Safe cleanup of temporary files
- ✅ Easy start/stop functionality
- ✅ Automatic updates via Git integration
- ✅ User-friendly menu interface

## 🆘 Troubleshooting

### Port 8000 already in use:
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /pid [PID] /f
```

### Docker not starting:
- Ensure Docker Desktop is running
- Restart Docker Desktop if needed
- Check Windows WSL2 installation

### Node.js issues:
- Ensure Node.js version 18+ is installed
- Run `npm install` in the rigged_wheel folder

---

**🎯 Pro Tip**: Use the control panel on your phone while the wheel is displayed on a big screen for the ultimate experience! Perfect for parties and events.

**🔒 Security Note**: This application is designed for local network use only. For internet access, consider proper security measures.