@echo off
echo ========================================
echo MEWAYZ V2 - Fix All Issues and Deploy
echo ========================================

echo.
echo Step 1: Starting MongoDB...
REM Kill any existing MongoDB processes
taskkill /f /im mongod.exe >nul 2>&1

REM Start MongoDB
echo Starting MongoDB 8.1...
"C:\Program Files\MongoDB\Server\8.1\bin\mongod.exe" --dbpath "C:\data\db" --port 27017 --bind_ip 127.0.0.1 >nul 2>&1 &

REM Wait for MongoDB to start
echo Waiting for MongoDB to start...
timeout /t 8 /nobreak >nul

echo.
echo Step 2: Testing MongoDB connection...
cd backend
python -c "import asyncio; from motor.motor_asyncio import AsyncIOMotorClient; async def test(): client = AsyncIOMotorClient('mongodb://localhost:27017'); await client.admin.command('ping'); print('MongoDB connected!'); client.close(); asyncio.run(test())" >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB connection successful!
) else (
    echo MongoDB connection failed, but continuing...
)

echo.
echo Step 3: Running production setup...
python scripts/setup_production.py >nul 2>&1

echo.
echo Step 4: Starting Backend Server...
start "MEWAYZ Backend" cmd /k "cd /d %cd% && python -m uvicorn main:app --host 127.0.0.1 --port 8002 --reload"

echo.
echo Step 5: Starting Frontend...
cd ../frontend
start "MEWAYZ Frontend" cmd /k "npm run dev"

echo.
echo Step 6: Waiting for services to start...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Services:
echo - Frontend: http://localhost:3002
echo - Backend API: http://localhost:8002
echo - API Docs: http://localhost:8002/api/docs
echo.
echo Admin Login:
echo - Email: admin@mewayz.com
echo - Password: admin123
echo.
echo If you see any errors:
echo 1. Check the command windows for error messages
echo 2. Make sure ports 3002 and 8002 are available
echo 3. MongoDB should be running on port 27017
echo.
echo Press any key to exit...
pause >nul 