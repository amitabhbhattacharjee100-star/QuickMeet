@echo off
echo ========================================
echo QuickMeet - Setup Checker
echo ========================================
echo.

set ERRORS=0

echo Checking prerequisites...
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js is NOT installed
    echo     Download from: https://nodejs.org/
    set /a ERRORS+=1
) else (
    echo [OK] Node.js is installed
    node --version
    npm --version
)
echo.

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [X] npm is NOT available
    set /a ERRORS+=1
) else (
    echo [OK] npm is available
)
echo.

REM Check dependencies
echo Checking dependencies...
if not exist "node_modules" (
    echo [X] Root dependencies not installed
    echo     Run: npm install
    set /a ERRORS+=1
) else (
    echo [OK] Root dependencies installed
)

if not exist "server\node_modules" (
    echo [X] Server dependencies not installed
    echo     Run: cd server ^&^& npm install
    set /a ERRORS+=1
) else (
    echo [OK] Server dependencies installed
)

if not exist "client\node_modules" (
    echo [X] Client dependencies not installed
    echo     Run: cd client ^&^& npm install
    set /a ERRORS+=1
) else (
    echo [OK] Client dependencies installed
)
echo.

REM Check .env file
echo Checking configuration...
if not exist "server\.env" (
    echo [X] server\.env file not found
    echo     Create server\.env with MongoDB connection
    set /a ERRORS+=1
) else (
    echo [OK] server\.env file exists
)
echo.

REM Summary
echo ========================================
if %ERRORS%==0 (
    echo [SUCCESS] All checks passed!
    echo.
    echo You can now run: START_APP.bat
    echo Or manually run: npm run dev
) else (
    echo [FAILED] Found %ERRORS% issue(s)
    echo.
    echo Please fix the issues above before running the app.
    echo See HOW_TO_RUN.md for detailed instructions.
)
echo ========================================
echo.
pause

