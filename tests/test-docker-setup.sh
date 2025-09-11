#!/bin/bash

# Docker Setup Test Script
echo "🧪 Testing Docker setup for Nexium RPG..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed or not in PATH"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Test building images
echo "🔨 Testing Docker image builds..."

# Test bot build
echo "Building bot image..."
cd bot
if docker-compose build --no-cache nexium-bot; then
    echo "✅ Bot image built successfully"
else
    echo "❌ Bot image build failed"
    exit 1
fi
cd ..

# Test web build
echo "Building web image..."
cd web
if docker-compose build --no-cache nexium-web; then
    echo "✅ Web image built successfully"
else
    echo "❌ Web image build failed"
    exit 1
fi
cd ..

# Test combined build
echo "Building combined setup..."
if docker-compose -f docker-compose.full.yml build --no-cache; then
    echo "✅ Combined setup built successfully"
else
    echo "❌ Combined setup build failed"
    exit 1
fi

echo "🎉 All Docker builds completed successfully!"
echo "📝 Next steps:"
echo "   1. Copy .env.example to .env in both bot/ and web/ directories"
echo "   2. Configure your environment variables"
echo "   3. Run: docker-compose up -d (in bot/ or web/ directories)"
echo "   4. Or run: docker-compose -f docker-compose.full.yml up -d (from root)"
