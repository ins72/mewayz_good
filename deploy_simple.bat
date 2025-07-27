@echo off
echo ========================================
echo MEWAYZ V2 Simple Deployment
echo ========================================

echo.
echo Starting Backend Server...
cd backend
start "MEWAYZ Backend" cmd /k "python -m uvicorn main:app --host 127.0.0.1 --port 8002 --reload"

echo.
echo Starting Frontend...
cd ../frontend
start "MEWAYZ Frontend" cmd /k "npm run dev"

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Deployment Started!
echo ========================================
echo.
echo Services:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8002
echo - API Docs: http://localhost:8002/api/docs
echo.
echo Note: If MongoDB is not available, the backend will show connection errors
echo but the API will still be accessible for testing.
echo.
echo Press any key to exit...
pause >nul 