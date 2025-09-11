@echo off
REM Nexium Web Docker Development Setup for Windows

echo 🚀 Setting up Nexium Web Application for Docker development...

REM Create necessary directories
if not exist "data" mkdir data
if not exist "logs" mkdir logs

REM Copy environment file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your configuration before running Docker!
)

REM Build and start the services
echo 🔨 Building Docker images...
docker-compose build

echo ▶️  Starting services...
docker-compose up -d

echo ✅ Web application setup complete!
echo 🌐 Web app available at: http://localhost:5000
echo 📊 Uptime Kuma available at: http://localhost:3001
echo 📱 Web logs: docker-compose logs -f nexium-web
echo ⏹️  Stop services: docker-compose down

pause
