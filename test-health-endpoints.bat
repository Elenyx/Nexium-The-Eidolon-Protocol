@echo off
REM Test Health Endpoints Script for Windows

echo 🧪 Testing Nexium RPG health endpoints...

echo Testing Web Application Health...
curl -s --max-time 5 http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Web Application is responding
    curl -s http://localhost:5000/health
) else (
    echo ❌ Web Application is not responding or not running
)
echo.

echo Testing Discord Bot Health...
curl -s --max-time 5 http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Discord Bot is responding
    curl -s http://localhost:3000/health
) else (
    echo ❌ Discord Bot is not responding or not running
)
echo.

echo Testing Uptime Kuma...
curl -s --max-time 5 http://localhost:3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Uptime Kuma is responding
) else (
    echo ❌ Uptime Kuma is not responding or not running
)
echo.

echo 🔍 Testing external services...

echo Testing Main Website...
curl -s --max-time 5 https://nexium-rpg.win >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Main Website is responding
) else (
    echo ❌ Main Website is not responding
)
echo.

echo 📋 Summary:
echo - Web App health endpoint: http://localhost:5000/health
echo - Bot health endpoint: http://localhost:3000/health
echo - Uptime Kuma dashboard: http://localhost:3001
echo - Status page: https://status.nexium-rpg.win
echo.
echo 💡 Next steps:
echo 1. Make sure your Cloudflare tunnel points to localhost:3001
echo 2. Access https://status.nexium-rpg.win to configure monitors
echo 3. Add the health endpoints as HTTP monitors
echo 4. Configure notifications for your Discord server

pause
