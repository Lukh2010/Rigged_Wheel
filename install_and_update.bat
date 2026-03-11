@echo off
chcp 65001 >nul
title Rigged Wheel Installer & Updater

echo ========================================
echo    Rigged Wheel - Docker Installer
echo ========================================
echo.

:check_docker
echo Checking if Docker is installed...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed!
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    echo After installation, restart this script.
    pause
    exit /b 1
)

echo Docker is installed!
echo Docker Version:
docker --version
echo.

:check_compose
echo Checking Docker Compose...
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Compose is not available!
    echo Please make sure Docker Desktop includes Docker Compose.
    pause
    exit /b 1
)

echo Docker Compose Version:
docker-compose --version
echo.

:menu
echo Choose an option:
echo 1. Install and Start Rigged Wheel
echo 2. Update and Restart Rigged Wheel  
echo 3. Stop Rigged Wheel
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

echo.

if "%choice%"=="1" goto install
if "%choice%"=="2" goto update
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto exit

echo Invalid choice! Please try again.
echo.
goto menu

:install
echo Installing and starting Rigged Wheel...
echo.

if exist rigged_wheel (
    echo Found existing installation.
    echo Removing old files...
    rmdir /s /q rigged_wheel
)

if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

if exist spin_log.txt (
    echo Removing spin_log.txt...
    del spin_log.txt
)

echo Pulling latest version...
git pull origin main

echo Building and starting Docker containers...
docker-compose up -d --build

echo.
echo ✅ Installation complete!
echo.
echo Access your Rigged Wheel at:
echo - Main Wheel: http://localhost:8000
echo - Control Panel: http://localhost:8000/control
echo.
echo To stop the application, run this script again and choose option 3.
echo.
pause
goto exit

:update
echo Updating Rigged Wheel...
echo.

echo Stopping existing containers...
docker-compose down

echo Pulling latest version...
git pull origin main

echo Removing old build cache...
docker system prune -f

echo Building and starting updated version...
docker-compose up -d --build

echo.
echo ✅ Update complete!
echo.
pause
goto exit

:stop
echo Stopping Rigged Wheel...
echo.
docker-compose down

echo Cleaning up...
docker system prune -f

echo.
echo ✅ Application stopped!
echo.
pause
goto exit

:exit
echo Thank you for using Rigged Wheel!
echo.
pause
exit /b 0