@echo off
echo ========================================
echo MEWAYZ V2 Final Deployment Script
echo ========================================

echo.
echo Step 1: Checking MongoDB...
netstat -an | findstr :27017 >nul
if %errorlevel% equ 0 (
    echo MongoDB is running on port 27017
) else (
    echo MongoDB is not running. Attempting to start...
    
    REM Try to start MongoDB service
    net start MongoDB >nul 2>&1
    if %errorlevel% equ 0 (
        echo MongoDB service started successfully
    ) else (
        echo MongoDB service failed. Trying manual start...
        
        REM Try different MongoDB paths
        if exist "C:\Program Files\MongoDB\Server\8.1\bin\mongod.exe" (
            echo Starting MongoDB 8.1...
            "C:\Program Files\MongoDB\Server\8.1\bin\mongod.exe" --dbpath "C:\data\db" --port 27017 --bind_ip 127.0.0.1 >nul 2>&1 &
        ) else if exist "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" (
            echo Starting MongoDB 8.0...
            "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db" --port 27017 --bind_ip 127.0.0.1 >nul 2>&1 &
        ) else if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
            echo Starting MongoDB 7.0...
            "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db" --port 27017 --bind_ip 127.0.0.1 >nul 2>&1 &
        ) else (
            echo MongoDB not found. Please install MongoDB first.
            echo You can download it from: https://www.mongodb.com/try/download/community
        )
        
        timeout /t 5 /nobreak >nul
    )
)

echo.
echo Step 2: Setting up Backend...
cd backend

REM Check if requirements are installed
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt >nul 2>&1

echo Running production setup...
python scripts/setup_production.py >nul 2>&1

echo Starting Backend Server...
start "MEWAYZ Backend" cmd /k "call venv\Scripts\activate.bat && python -m uvicorn main:app --host 127.0.0.1 --port 8002 --reload"

echo.
echo Step 3: Setting up Frontend...
cd ../frontend

echo Installing dependencies...
npm install --legacy-peer-deps >nul 2>&1

echo Starting Frontend...
start "MEWAYZ Frontend" cmd /k "npm run dev"

echo.
echo Step 4: Waiting for services to start...
timeout /t 15 /nobreak >nul

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
echo If you see any errors:
echo 1. Check if MongoDB is running
echo 2. Check if ports 3000 and 8002 are available
echo 3. Run this script as Administrator if needed
echo.
echo Press any key to exit...
pause >nul 