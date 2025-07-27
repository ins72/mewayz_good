@echo off
echo ========================================
echo MEWAYZ V2 - Deploy with New Ports
echo ========================================
echo.
echo Ports Configuration:
echo - Frontend: 3003
echo - Backend: 8003  
echo - MongoDB: 5003
echo.

echo Step 1: Stopping all existing instances...
taskkill /f /im mongod.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im uvicorn.exe >nul 2>&1

echo Step 2: Creating MongoDB data directory...
if not exist "C:\data\db" (
    mkdir "C:\data\db" >nul 2>&1
    echo Created MongoDB data directory
) else (
    echo MongoDB data directory already exists
)

echo Step 3: Starting MongoDB on port 5003...
"C:\Program Files\MongoDB\Server\8.1\bin\mongod.exe" --dbpath "C:\data\db" --port 5003 --bind_ip 127.0.0.1 >nul 2>&1 &

echo Waiting for MongoDB to start...
timeout /t 8 /nobreak >nul

echo Step 4: Testing MongoDB connection...
cd backend
python -c "import asyncio; from motor.motor_asyncio import AsyncIOMotorClient; async def test(): client = AsyncIOMotorClient('mongodb://localhost:5003'); await client.admin.command('ping'); print('MongoDB connected on port 5003!'); client.close(); asyncio.run(test())" >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB connection successful on port 5003!
) else (
    echo MongoDB connection failed, but continuing...
)

echo Step 5: Running production setup...
python scripts/setup_production.py >nul 2>&1

echo Step 6: Starting Backend Server on port 8003...
start "MEWAYZ Backend (8003)" cmd /k "cd /d %cd% && python -m uvicorn main:app --host 127.0.0.1 --port 8003 --reload"

echo Step 7: Starting Frontend on port 3003...
cd ../frontend
start "MEWAYZ Frontend (3003)" cmd /k "npm run dev"

echo Step 8: Waiting for services to start...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Services:
echo - Frontend: http://localhost:3003
echo - Backend API: http://localhost:8003
echo - API Docs: http://localhost:8003/api/docs
echo - MongoDB: localhost:5003
echo.
echo Admin Login:
echo - Email: admin@mewayz.com
echo - Password: admin123
echo.
echo All services are now running on the new ports!
echo.
echo Press any key to exit...
pause >nul 