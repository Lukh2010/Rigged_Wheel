# Rigged Lucky Wheel

You can rig this wheel and have fun with your friends. 

## 🐳 Docker Installation (Recommended)

### With Docker Compose (easiest):
```bash
docker-compose up -d
```

### With Dockerfile:
```bash
docker build -t rigged-wheel .
docker run -d -p 8000:8000 --name rigged-wheel rigged-wheel
```

## 📦 Traditional Installation

### Install npm dependencies:
```bash
cd rigged_wheel
npm install
```

### Install Node.js:
- Fedora: `sudo dnf install nodejs`
- Windows: https://nodejs.org

### Start the server:
```bash
node server.js
```

## 🎮 Usage

- Main Wheel: http://localhost:8000
- Control Panel: http://localhost:8000/control
- Keyboard Shortcuts: Press 'N' for DARK, 'M' for LIGHT

## 🐳 Docker Commands
```bash
# Start in background
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs

# Restart
docker-compose restart
```

