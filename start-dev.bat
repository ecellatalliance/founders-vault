@echo off
echo ========================================
echo E-Cell Store - React Edition
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo.
    call npm install
    echo.
    echo Dependencies installed!
    echo.
)

echo Starting development server...
echo.
echo The app will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
