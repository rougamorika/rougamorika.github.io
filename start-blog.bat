@echo off
cd /d "%~dp0"

where node >nul 2>nul
if not %errorlevel%==0 (
    echo Node.js not found. Please install Node.js first.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if not %errorlevel%==0 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
)

echo Starting blog dev server...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"

call npm run dev

pause
