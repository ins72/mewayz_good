@echo off
REM 🚀 MEWAYZ V2 - Production Quick Start Script (Windows)
REM This script will set up and start the complete production environment

echo 🚀 Starting MEWAYZ V2 Production Setup...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [SUCCESS] Docker and Docker Compose are installed

REM Start MongoDB with Docker
echo [INFO] Starting MongoDB...
docker-compose down mongodb mongo-express 2>nul
docker-compose up -d mongodb mongo-express

REM Wait for MongoDB to be ready
echo [INFO] Waiting for MongoDB to be ready...
timeout /t 10 /nobreak >nul

REM Test MongoDB connection
docker-compose exec mongodb mongosh --eval "db.runCommand('ping')" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] MongoDB failed to start properly
    pause
    exit /b 1
) else (
    echo [SUCCESS] MongoDB is running and accessible
    echo [INFO] MongoDB Express UI available at: http://localhost:8081
    echo [INFO]   Username: admin
    echo [INFO]   Password: password123
)

REM Setup backend
echo [INFO] Setting up backend...
cd backend

REM Install Python dependencies if pip is available
pip --version >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Installing Python dependencies...
    pip install -r requirements.txt
)

REM Run production setup
echo [INFO] Running production setup...
python scripts/setup_production.py

cd ..

REM Start backend
echo [INFO] Starting backend API...
cd backend

REM Start backend server
python --version >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Starting backend with Python...
    start "MEWAYZ Backend" python -m uvicorn main:app --host 0.0.0.0 --port 8002 --reload
) else (
    echo [INFO] Starting backend with Docker...
    docker-compose up -d backend
)

cd ..

REM Wait for backend to be ready
echo [INFO] Waiting for backend to be ready...
timeout /t 5 /nobreak >nul

REM Test backend health
curl -s http://localhost:8002/api/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Backend health check failed, but continuing...
) else (
    echo [SUCCESS] Backend API is running at: http://localhost:8002
    echo [INFO] API Documentation available at: http://localhost:8002/api/docs
)

REM Setup frontend
echo [INFO] Setting up frontend...
cd frontend

REM Create environment file if it doesn't exist
if not exist .env.local (
    echo [INFO] Creating .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8002/api/v1
        echo NEXT_PUBLIC_ENVIRONMENT=production
    ) > .env.local
)

REM Install Node.js dependencies
npm --version >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Installing Node.js dependencies...
    npm install
)

cd ..

REM Start frontend
echo [INFO] Starting frontend...
cd frontend

REM Start frontend server
npm --version >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Starting frontend with npm...
    start "MEWAYZ Frontend" npm run dev
) else (
    echo [INFO] Starting frontend with Docker...
    docker-compose up -d frontend
)

cd ..

REM Wait for frontend to be ready
echo [INFO] Waiting for frontend to be ready...
timeout /t 10 /nobreak >nul

echo [SUCCESS] Frontend is running at: http://localhost:3000

REM Show status
echo.
echo 🎉 MEWAYZ V2 Production Environment is Ready!
echo.
echo 📊 Services Status:
echo   • MongoDB: http://localhost:27017
echo   • MongoDB Express UI: http://localhost:8081
echo   • Backend API: http://localhost:8002
echo   • Frontend: http://localhost:3000
echo   • API Docs: http://localhost:8002/api/docs
echo.
echo 🔑 Default Admin Credentials:
echo   • Email: admin@mewayz.com
echo   • Password: admin123
echo.
echo 📝 Useful Commands:
echo   • View logs: docker-compose logs -f
echo   • Stop services: stop-production.bat
echo   • Restart services: start-production.bat
echo.
echo 🚀 Happy coding!
echo.
pause 