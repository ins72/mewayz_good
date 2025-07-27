@echo off
echo ========================================
echo MEWAYZ V2 - Deployment Script
echo Ports: Frontend 3000, Backend 8000, MongoDB 5000
echo ========================================

echo.
echo [1/4] Stopping any existing services...
taskkill /f /im mongod.exe 2>nul
taskkill /f /im node.exe 2>nul
taskkill /f /im python.exe 2>nul

echo.
echo [2/4] Creating MongoDB data directory...
if not exist "C:\data\db" mkdir "C:\data\db"
if not exist "C:\data\log" mkdir "C:\data\log"

echo.
echo [3/4] Starting MongoDB on port 5000...
start "MongoDB" /min cmd /c "C:\Program Files\MongoDB\Server\8.1\bin\mongod.exe" --port 5000 --dbpath "C:\data\db" --logpath "C:\data\log\mongod.log" --bind_ip 127.0.0.1
timeout /t 3 /nobreak >nul

echo.
echo [4/4] Starting Backend API on port 8000...
cd backend
start "Backend API" /min cmd /c "python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 3 /nobreak >nul

echo.
echo [5/5] Starting Frontend on port 3000...
cd ..\frontend
start "Frontend" /min cmd /c "npm run dev"

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Services:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Docs: http://localhost:8000/api/docs
echo - MongoDB: localhost:5000
echo.
echo Admin Login:
echo - Email: admin@mewayz.com
echo - Password: admin123
echo.
echo Press any key to exit...
pause >nul 