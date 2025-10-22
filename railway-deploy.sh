#!/bin/bash

echo "🚀 Deploying Treehole P2P Relay to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Logging into Railway..."
railway login

# Create new Railway project
echo "📦 Creating Railway project..."
railway init

# Set environment variables
echo "⚙️ Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=9001
railway variables set WS_PORT=9002
railway variables set HEALTH_PORT=3000

# Deploy the project
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your relay will be available at: https://your-app.railway.app"
echo "🏥 Health check: https://your-app.railway.app/health"