@echo off
REM 🛑 MEWAYZ V2 - Production Stop Script (Windows)
REM This script will cleanly stop all production services

echo 🛑 Stopping MEWAYZ V2 Production Environment...

REM Stop Docker containers
echo [INFO] Stopping Docker services...
docker-compose down 2>nul
if errorlevel 1 (
    echo [WARNING] Docker Compose not found, skipping Docker services
) else (
    echo [SUCCESS] Docker services stopped
)

REM Kill Node.js processes
echo [INFO] Checking for remaining Node.js processes...
taskkill /f /im node.exe 2>nul
if errorlevel 1 (
    echo [INFO] No Node.js processes found
) else (
    echo [SUCCESS] Killed remaining Node.js processes
)

REM Kill Python processes
echo [INFO] Checking for remaining Python processes...
taskkill /f /im python.exe 2>nul
if errorlevel 1 (
    echo [INFO] No Python processes found
) else (
    echo [SUCCESS] Killed remaining Python processes
)

REM Clean up temporary files
echo [INFO] Cleaning up temporary files...
if exist backend\.backend.pid del backend\.backend.pid
if exist frontend\.frontend.pid del frontend\.frontend.pid

REM Check for clean logs flag
if "%1"=="--clean-logs" (
    echo [INFO] Clean logs mode enabled
    if exist backend\*.log del backend\*.log
    if exist frontend\.next\logs\* del frontend\.next\logs\*
    echo [SUCCESS] Log files cleaned
)

echo [SUCCESS] Temporary files cleaned

REM Show final status
echo.
echo ✅ MEWAYZ V2 Production Environment Stopped
echo.
echo 📊 Services Status:
echo   • MongoDB: Stopped
echo   • Backend API: Stopped
echo   • Frontend: Stopped
echo.
echo 💡 To restart services, run:
echo   • start-production.bat
echo.
echo 🔧 To start individual services:
echo   • MongoDB: docker-compose up -d mongodb
echo   • Backend: cd backend ^&^& python -m uvicorn main:app --host 0.0.0.0 --port 8002
echo   • Frontend: cd frontend ^&^& npm run dev
echo.
pause 