#!/bin/bash

# Test Health Endpoints Script
echo "🧪 Testing Nexium RPG health endpoints..."

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local service_name=$2
    
    echo "Testing $service_name at $url..."
    
    if curl -s --max-time 5 "$url" > /dev/null; then
        echo "✅ $service_name is responding"
        curl -s "$url" | jq . 2>/dev/null || curl -s "$url"
    else
        echo "❌ $service_name is not responding or not running"
    fi
    echo ""
}

# Test Web Application Health
test_endpoint "http://localhost:5000/health" "Web Application"

# Test Discord Bot Health
test_endpoint "http://localhost:3000/health" "Discord Bot"

# Test Uptime Kuma
test_endpoint "http://localhost:3001" "Uptime Kuma"

echo "🔍 Testing external services..."

# Test main website (if accessible)
test_endpoint "https://nexium-rpg.win" "Main Website"

echo "📋 Summary:"
echo "- Web App health endpoint: http://localhost:5000/health"
echo "- Bot health endpoint: http://localhost:3000/health"
echo "- Uptime Kuma dashboard: http://localhost:3001"
echo "- Status page: https://status.nexium-rpg.win"
echo ""
echo "💡 Next steps:"
echo "1. Make sure your Cloudflare tunnel points to localhost:3001"
echo "2. Access https://status.nexium-rpg.win to configure monitors"
echo "3. Add the health endpoints as HTTP monitors"
echo "4. Configure notifications for your Discord server"
