@echo off
echo ========================================
echo QuickMeet - Application Starter
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart this script after installation
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
npm --version
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo [WARNING] Dependencies not installed in root folder
    echo Installing root dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install root dependencies
        pause
        exit /b 1
    )
)

if not exist "server\node_modules" (
    echo [WARNING] Server dependencies not installed
    echo Installing server dependencies...
    cd server
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install server dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

if not exist "client\node_modules" (
    echo [WARNING] Client dependencies not installed
    echo Installing client dependencies...
    cd client
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install client dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

REM Check if .env file exists
if not exist "server\.env" (
    echo [WARNING] server\.env file not found!
    echo.
    echo Creating server\.env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/quickmeet
        echo JWT_SECRET=quickmeet-secret-key-change-in-production-2024
        echo NODE_ENV=development
        echo CLIENT_URL=http://localhost:3000
    ) > server\.env
    echo [OK] Created server\.env file
    echo.
    echo IMPORTANT: Make sure MongoDB is running!
    echo If using MongoDB Atlas, update MONGODB_URI in server\.env
    echo.
    timeout /t 5
)

echo.
echo ========================================
echo Starting QuickMeet Application...
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.
echo ========================================
echo.

REM Start the application
call npm run dev

pause

