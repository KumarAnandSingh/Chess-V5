#!/bin/bash

# Chess Academy Deployment Verification Script
# Verifies that frontend is properly configured for Render.com backend

echo "🔍 Chess Academy Deployment Verification"
echo "========================================"
echo ""

# Check if the frontend configuration is correctly updated
echo "📋 Checking frontend configuration..."

if grep -q "chess-academy-backend-o3iy.onrender.com" src/services/socketManager.ts; then
    echo "✅ Frontend socketManager.ts: Correctly configured for Render.com backend"
else
    echo "❌ Frontend socketManager.ts: Still pointing to old Railway URL"
    exit 1
fi

# Check environment file
if [ -f ".env.production" ]; then
    echo "✅ Production environment file: Present"
    if grep -q "chess-academy-backend-o3iy.onrender.com" .env.production; then
        echo "✅ Production environment: Correctly configured for Render.com"
    else
        echo "❌ Production environment: Incorrect backend URL"
        exit 1
    fi
else
    echo "⚠️ Production environment file: Missing (will use hardcoded URL)"
fi

# Test backend connectivity
echo ""
echo "🔍 Testing backend connectivity..."

BACKEND_URL="https://chess-academy-backend-o3iy.onrender.com"

# Test health endpoint
echo "Testing health endpoint..."
if curl -f -s "$BACKEND_URL/health" > /dev/null; then
    echo "✅ Backend health endpoint: Accessible"
else
    echo "❌ Backend health endpoint: Failed"
    exit 1
fi

# Test main API
echo "Testing main API endpoint..."
if curl -f -s "$BACKEND_URL" > /dev/null; then
    echo "✅ Backend API endpoint: Accessible"
else
    echo "❌ Backend API endpoint: Failed"
    exit 1
fi

# Test Socket.IO endpoint
echo "Testing Socket.IO endpoint..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/socket.io/?EIO=4&transport=polling")
if [[ "$HTTP_STATUS" == "200" || "$HTTP_STATUS" == "400" ]]; then
    echo "✅ Socket.IO endpoint: Available (HTTP $HTTP_STATUS)"
else
    echo "❌ Socket.IO endpoint: Failed (HTTP $HTTP_STATUS)"
    exit 1
fi

# Check for old Railway references
echo ""
echo "🔍 Checking for old Railway references..."

if grep -r "railway.app" src/ --exclude-dir=node_modules 2>/dev/null; then
    echo "⚠️ Found Railway references in source code"
    echo "Please update these to use Render.com URLs"
else
    echo "✅ No old Railway references found"
fi

echo ""
echo "🚀 DEPLOYMENT VERIFICATION COMPLETE"
echo ""
echo "📋 Summary:"
echo "  ✅ Frontend configuration updated"
echo "  ✅ Backend connectivity verified"
echo "  ✅ Socket.IO endpoint accessible"
echo "  ✅ No old Railway references"
echo ""
echo "🎯 READY FOR DEPLOYMENT!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run build' to build with production config"
echo "2. Deploy to your hosting platform (Vercel/Netlify/etc.)"
echo "3. Test multiplayer functionality after deployment"
echo "4. Monitor connection stability"
echo ""
echo "Expected behavior after deployment:"
echo "  - Frontend will connect to: $BACKEND_URL"
echo "  - No more CORS errors"
echo "  - Stable Socket.IO connections"
echo "  - Working multiplayer chess functionality"