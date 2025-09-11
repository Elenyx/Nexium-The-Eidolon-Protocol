#!/bin/bash

# Railway Force Redeploy Script
# This will force Railway to rebuild and redeploy with correct environment variables

echo "🚀 FORCING RAILWAY REDEPLOY..."

# Create a timestamp to force rebuild
echo "# Force rebuild timestamp: $(date)" >> railway-deploy.txt

# Show current environment variables that MUST be set in Railway
echo "📋 REQUIRED RAILWAY ENVIRONMENT VARIABLES:"
echo "VITE_UPTIME_KUMA_URL=https://status.nexium-rpg.win/status/nexium"
echo "NODE_ENV=production"
echo "PORT=5000"
echo ""

echo "🔧 TO FIX RAILWAY DEPLOYMENT:"
echo "1. Go to Railway Dashboard"
echo "2. Select your web service"
echo "3. Go to Variables tab"
echo "4. Add: VITE_UPTIME_KUMA_URL=https://status.nexium-rpg.win/status/nexium"
echo "5. Click 'Deploy' or wait for auto-deploy"
echo ""

echo "✅ After setting the environment variable, Railway will show:"
echo "- Status link with external icon (🔗)"
echo "- Clicking Status opens https://status.nexium-rpg.win/status/nexium in new tab"
echo "- No more internal status page errors"

git add .
git commit -m "RAILWAY FIX: Force redeploy with production environment"
git push origin main

echo ""
echo "🎯 PUSHED TO GITHUB - NOW SET THE RAILWAY ENV VAR!"
echo "VITE_UPTIME_KUMA_URL=https://status.nexium-rpg.win/status/nexium"
