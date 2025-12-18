@echo off
echo ==========================================
echo 🚀 Starting The Founders Vault...
echo ==========================================

:: Start Backend
echo 📦 Starting Backend Server...
start "Founders Vault Backend" cmd /k "cd backend && npm run dev"

:: Start Frontend
echo 🎨 Starting Frontend Client...
start "Founders Vault Frontend" cmd /k "cd frontend && npm run dev"

:: Wait for servers to spin up (5 seconds)
echo ⏳ Waiting for servers to launch...
timeout /t 5 /nobreak >nul

:: Open Browser
echo 🌐 Opening Website...
start http://localhost:5173

echo ==========================================
echo ✅ System Online!
echo You can minimize the other windows, but don't close them.
echo ==========================================
pause
