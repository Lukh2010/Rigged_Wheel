# Rigged Wheel - Docker Setup

## Mit Docker ausführen (einfachste Methode)

### Voraussetzungen
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installieren

### Schnellstart
```bash
# Im Projektverzeichnis ausführen
docker-compose up -d
```

Die App ist dann erreichbar unter:
- Hauptseite: http://localhost:8000
- Control Panel: http://localhost:8000/control

### Befehle
```bash
# App starten
docker-compose up -d

# App stoppen
docker-compose down

# Logs anzeigen
docker-compose logs

# App neustarten
docker-compose restart
```

## Mit Dockerfile bauen und ausführen

```bash
# Image bauen
docker build -t rigged-wheel .

# Container starten
docker run -d -p 8000:8000 --name rigged-wheel-container rigged-wheel

# Container stoppen
docker stop rigged-wheel-container

# Container entfernen
docker rm rigged-wheel-container
```

## Für Entwicklung
```bash
# Live mit Logs
docker-compose up

# Im Hintergrund
docker-compose up -d
```

## Ports
- **8000**: Web App (lokal: http://localhost:8000)

## Features
- ✅ Automatischer Neustart bei Fehlern
- ✅ Port forwarding konfiguriert
- ✅ Produktionsoptimiert
- ✅ Einfache Deployment