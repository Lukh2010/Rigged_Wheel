@echo off
chcp 65001 >nul
title Rigged Wheel - Auto Installer & Launcher

echo ========================================
echo    Rigged Wheel - Auto Installer
echo ========================================
echo.

:check_docker
echo Checking if Docker is installed...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo ✅ Docker is installed!
docker --version
echo.

:check_compose
echo Checking Docker Compose...
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose not found!
    echo Please make sure Docker Desktop includes Docker Compose.
    pause
    exit /b 1
)

echo ✅ Docker Compose ready!
docker-compose --version
echo.

:cleanup
echo Cleaning up temporary files...

if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules 2>nul
)

if exist spin_log.txt (
    echo Removing spin log...
    del spin_log.txt 2>nul
)

echo.

:update
echo Updating to latest version...
git pull origin main

echo.

:build
echo Building and starting Rigged Wheel...
echo This may take a few minutes...
echo.

docker-compose up -d --build

if %errorlevel% neq 0 (
    echo.
    echo ❌ Build failed! Check Docker Desktop for errors.
    pause
    exit /b 1
)

echo.
echo ✅ Rigged Wheel is now running!
echo.
echo 🌐 Access your wheel at:
echo    http://localhost:8000
echo.
echo 🎮 Control panel:
echo    http://localhost:8000/control
echo.
echo Press Ctrl+C to stop the application and exit.
echo.

:wait_loop
echo Type 'exit' to stop the application and close...
echo.
set /p user_input="">nul

if /i "%user_input%"=="exit" goto stop_app
goto wait_loop

:stop_app
echo.
echo Stopping Rigged Wheel...
docker-compose down

echo Cleaning up...
docker system prune -f

echo.
echo ✅ Application stopped. Goodbye!
timeout /t 2 /nobreak >nul
exit /b 0