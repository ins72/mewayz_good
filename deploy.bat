@echo off
echo ========================================
echo MEWAYZ V2 Deployment Script
echo ========================================

echo.
echo Step 1: Checking MongoDB...
netstat -an | findstr :27017 >nul
if %errorlevel% equ 0 (
    echo MongoDB is running on port 27017
) else (
    echo MongoDB is not running. Starting MongoDB...
    echo Please run this script as Administrator if MongoDB fails to start.
    net start MongoDB >nul 2>&1
    if %errorlevel% equ 0 (
        echo MongoDB started successfully
    ) else (
        echo Failed to start MongoDB service. Trying manual start...
        "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db" --port 27017 --bind_ip 127.0.0.1 >nul 2>&1 &
        timeout /t 5 /nobreak >nul
    )
)

echo.
echo Step 2: Starting Backend Server...
cd backend
start "MEWAYZ Backend" cmd /k "python -m uvicorn main:app --host 127.0.0.1 --port 8002 --reload"

echo.
echo Step 3: Starting Frontend...
cd ../frontend
start "MEWAYZ Frontend" cmd /k "npm run dev"

echo.
echo Step 4: Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Services:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8002
echo - API Docs: http://localhost:8002/api/docs
echo.
echo Admin Login:
echo - Email: admin@mewayz.com
echo - Password: admin123
echo.
echo Press any key to exit...
pause >nul 