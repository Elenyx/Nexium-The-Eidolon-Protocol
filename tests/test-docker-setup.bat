@echo off
REM Docker Setup Test Script for Windows

echo 🧪 Testing Docker setup for Nexium RPG...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not in PATH
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed or not in PATH
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Test building images
echo 🔨 Testing Docker image builds...

REM Test bot build
echo Building bot image...
cd bot
docker-compose build --no-cache nexium-bot
if %errorlevel% neq 0 (
    echo ❌ Bot image build failed
    exit /b 1
)
echo ✅ Bot image built successfully
cd ..

REM Test web build
echo Building web image...
cd web
docker-compose build --no-cache nexium-web
if %errorlevel% neq 0 (
    echo ❌ Web image build failed
    exit /b 1
)
echo ✅ Web image built successfully
cd ..

REM Test combined build
echo Building combined setup...
docker-compose -f docker-compose.full.yml build --no-cache
if %errorlevel% neq 0 (
    echo ❌ Combined setup build failed
    exit /b 1
)
echo ✅ Combined setup built successfully

echo 🎉 All Docker builds completed successfully!
echo 📝 Next steps:
echo    1. Copy .env.example to .env in both bot/ and web/ directories
echo    2. Configure your environment variables
echo    3. Run: docker-compose up -d (in bot/ or web/ directories)
echo    4. Or run: docker-compose -f docker-compose.full.yml up -d (from root)

pause
