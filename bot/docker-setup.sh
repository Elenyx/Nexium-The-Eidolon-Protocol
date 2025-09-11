#!/bin/bash

# Nexium Bot Docker Development Setup
echo "🚀 Setting up Nexium Discord Bot for Docker development..."

# Create necessary directories
mkdir -p data logs

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your Discord bot credentials before running Docker!"
fi

# Build and start the services
echo "🔨 Building Docker images..."
docker-compose build

echo "▶️  Starting services..."
docker-compose up -d

echo "✅ Bot setup complete!"
echo "📊 Uptime Kuma available at: http://localhost:3002"
echo "🤖 Bot logs: docker-compose logs -f nexium-bot"
echo "⏹️  Stop services: docker-compose down"
