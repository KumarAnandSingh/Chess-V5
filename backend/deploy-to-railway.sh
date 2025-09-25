#!/bin/bash

# Deploy complete backend to Railway
# This script updates Railway with the complete multiplayer backend

echo "🚀 Deploying complete Chess Academy backend to Railway..."

# Check if railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Navigate to backend directory
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"
echo "📋 Files to deploy:"
ls -la

# Check if we have the complete server file
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found!"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

echo "✅ Required files found"

# Try to determine the project ID
echo "🔍 Checking Railway project status..."

# Check if already linked to a project
if railway status 2>/dev/null; then
    echo "✅ Already linked to Railway project"
else
    echo "⚠️  Not linked to Railway project"
    echo "Please run 'railway link' to connect to your project first"
    echo ""
    echo "Or create a new project with:"
    echo "railway create --name chess-academy-backend"
    echo ""
    echo "Then run this script again"
    exit 1
fi

# Deploy the backend
echo "🚀 Starting deployment..."

# Deploy using Railway CLI
railway up

echo "✅ Deployment completed!"
echo ""
echo "🧪 Testing deployment..."

# Wait a moment for deployment to complete
sleep 10

# Test the deployment
echo "📋 Testing Railway endpoint..."
if curl -s "https://web-production-4fb4.up.railway.app/" | grep -q "Chess Academy Backend Running"; then
    echo "✅ Deployment successful! Backend is responding correctly."
else
    echo "⚠️  Backend deployed but may still be starting up..."
    echo "Check Railway logs with: railway logs"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Test multiplayer functionality at: https://elaborate-twilight-0dd8b0.netlify.app"
echo "2. Check Railway logs: railway logs"
echo "3. Monitor Railway dashboard: https://railway.app"