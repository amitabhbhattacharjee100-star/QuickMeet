@echo off
echo ========================================
echo QuickMeet - Quick Start Script
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Step 1: Installing root dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing server dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install server dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Step 3: Installing client dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install client dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo IMPORTANT: Before running the app:
echo 1. Create server/.env file (see START_HERE.md)
echo 2. Make sure MongoDB is running
echo.
echo To start the app, run: npm run dev
echo.
pause

