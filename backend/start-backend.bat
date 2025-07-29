@echo off
echo =========================================
echo 🚀 Starting KeplerX Backend Server
echo =========================================
echo.
echo 📋 Installing Dependencies...
call npm install
echo.
echo 🔧 Building TypeScript...
call npm run build
echo.
echo 🌐 Starting Development Server...
call npm run dev
echo.
pause 