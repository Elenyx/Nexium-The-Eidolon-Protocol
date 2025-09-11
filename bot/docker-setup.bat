@echo off
REM Nexium Bot Docker Development Setup for Windows

echo 🚀 Setting up Nexium Discord Bot for Docker development...

REM Create necessary directories
if not exist "data" mkdir data
if not exist "logs" mkdir logs

REM Copy environment file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your Discord bot credentials before running Docker!
)

REM Build and start the services
echo 🔨 Building Docker images...
docker-compose build

echo ▶️  Starting services...
docker-compose up -d

echo ✅ Bot setup complete!
echo 📊 Uptime Kuma available at: http://localhost:3002
echo 🤖 Bot logs: docker-compose logs -f nexium-bot
echo ⏹️  Stop services: docker-compose down

pause
