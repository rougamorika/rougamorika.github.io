@echo off

echo Stopping blog dev server...
echo.

tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Found Node.js processes, stopping...
    taskkill /F /IM node.exe /T >nul 2>&1
    if %errorlevel%==0 (
        echo Node.js processes stopped successfully
    ) else (
        echo Warning: Failed to stop processes, may need admin rights
    )
) else (
    echo No Node.js processes found
)

echo.
echo Done!
echo.

timeout /t 2 >nul
