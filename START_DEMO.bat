@echo off
echo ========================================
echo QuickMeet - Demo Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python not found. Opening demo.html directly...
    echo.
    start demo.html
    exit /b 0
)

echo Python found! Starting demo server...
echo.
echo The demo will open in your browser automatically.
echo Press Ctrl+C to stop the server.
echo.

python simple-server.py

pause

