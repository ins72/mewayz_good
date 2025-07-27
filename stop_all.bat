@echo off
echo ========================================
echo Stopping All MEWAYZ V2 Instances
echo ========================================

echo.
echo Stopping MongoDB...
taskkill /f /im mongod.exe >nul 2>&1

echo Stopping Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo Stopping Python processes...
taskkill /f /im python.exe >nul 2>&1

echo Stopping Uvicorn processes...
taskkill /f /im uvicorn.exe >nul 2>&1

echo.
echo Checking for any remaining processes...
netstat -ano | findstr ":27017\|:8002\|:3002" >nul 2>&1
if %errorlevel% equ 0 (
    echo Some processes may still be running on ports 27017, 8002, or 3002
    echo You may need to manually close them or restart your computer
) else (
    echo All MEWAYZ V2 instances have been stopped successfully!
)

echo.
echo ========================================
echo All instances stopped!
echo ========================================
pause 