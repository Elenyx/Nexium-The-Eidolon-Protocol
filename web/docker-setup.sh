#!/bin/bash

# Nexium Web Docker Development Setup
echo "🚀 Setting up Nexium Web Application for Docker development..."

# Create necessary directories
mkdir -p data logs

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before running Docker!"
fi

# Build and start the services
echo "🔨 Building Docker images..."
docker-compose build

echo "▶️  Starting services..."
docker-compose up -d

echo "✅ Web application setup complete!"
echo "🌐 Web app available at: http://localhost:5000"
echo "📊 Uptime Kuma available at: http://localhost:3001"
echo "📱 Web logs: docker-compose logs -f nexium-web"
echo "⏹️  Stop services: docker-compose down"
