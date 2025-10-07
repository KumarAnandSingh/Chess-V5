# Railway Deployment Guide - Chess Academy Backend

## Overview
This guide covers deploying the Chess Academy backend to Railway with PostgreSQL database and Google OAuth integration.

## Prerequisites
- Railway CLI installed (`npm install -g @railway/cli`)
- Google Cloud Console account for OAuth setup
- Chess Academy backend with TypeScript, Express, Prisma ORM

## Step 1: Railway Setup

### 1.1 Login to Railway
```bash
railway login
```

### 1.2 Initialize Railway Project
```bash
# From the backend directory
cd /Users/priyasingh/chess-academy/backend
railway init
# Choose: Create new project
# Enter project name: chess-academy-backend
```

### 1.3 Add PostgreSQL Database
```bash
railway add postgresql
```

### 1.4 Get Database URL
```bash
railway variables
# Note the DATABASE_URL value for your .env file
```

## Step 2: Google OAuth Setup

### 2.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing project
3. Enable "Google+ API" or "Google OAuth2 API"

### 2.2 Create OAuth Credentials
1. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
2. Application type: "Web application"
3. Name: "Chess Academy Backend"
4. Authorized redirect URIs:
   - For development: `http://localhost:3001/api/auth/google/callback`
   - For Railway: `https://your-domain.railway.app/api/auth/google/callback`
5. Copy Client ID and Client Secret

### 2.3 Configure OAuth Consent Screen
1. Go to "OAuth consent screen"
2. User Type: External (or Internal for workspace)
3. Fill required fields:
   - App name: "Chess Academy"
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`
5. Add test users (if in testing mode)

## Step 3: Environment Variables

### 3.1 Set Railway Environment Variables
```bash
# Database (automatically set by Railway)
railway variables set DATABASE_URL=${{ Postgres.DATABASE_URL }}

# JWT Configuration
railway variables set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
railway variables set JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
railway variables set JWT_EXPIRES_IN="24h"
railway variables set JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
railway variables set NODE_ENV="production"
railway variables set CORS_ORIGIN="https://your-frontend-domain.com"

# Google OAuth
railway variables set GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
railway variables set GOOGLE_CLIENT_SECRET="your-google-client-secret"
railway variables set GOOGLE_CALLBACK_URL="https://your-backend-domain.railway.app/api/auth/google/callback"

# Security
railway variables set BCRYPT_ROUNDS="12"
railway variables set COOKIE_SECRET="your-super-secret-cookie-key"

# Optional: External APIs
railway variables set OPENAI_API_KEY="your-openai-api-key"
railway variables set TRAINING_ENGINE_URL="your-engine-api-url"
```

### 3.2 Update Local .env for Testing
Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
# Edit .env with your local values
```

## Step 4: Database Migration

### 4.1 Local Migration (Development)
```bash
# Generate Prisma client
npm run db:generate

# Push schema to development database
npm run db:push

# Or run migrations
npm run db:migrate
```

### 4.2 Production Migration (Railway)
```bash
# Connect to Railway environment
railway link

# Generate Prisma client for production
railway run npm run db:generate

# Push schema to production database
railway run npm run db:push
```

## Step 5: Deployment

### 5.1 Deploy to Railway
```bash
# Deploy current code
railway up

# Or connect GitHub repository for automatic deployments
railway connect github
```

### 5.2 Check Deployment Status
```bash
railway status
railway logs
```

### 5.3 Get Deployment URL
```bash
railway domain
# Note the URL for Google OAuth callback setup
```

## Step 6: Testing

### 6.1 Health Check
```bash
curl https://your-domain.railway.app/health
```

### 6.2 Test API Endpoints
```bash
# Test registration
curl -X POST https://your-domain.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "displayName": "Test User",
    "password": "Password123"
  }'

# Test Google OAuth
# Visit: https://your-domain.railway.app/api/auth/google
```

### 6.3 Test Google OAuth Flow
1. Visit: `https://your-domain.railway.app/api/auth/google`
2. Should redirect to Google login
3. After authentication, should redirect to frontend with token

## Step 7: Frontend Integration

### 7.1 Update Frontend Configuration
```javascript
// frontend config
const API_BASE_URL = "https://your-domain.railway.app/api";

// OAuth login button
const handleGoogleLogin = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

// Handle OAuth callback in frontend
// URL: https://your-frontend.com/auth/success?token=...
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    localStorage.setItem('accessToken', token);
    // Redirect to dashboard
  }
}, []);
```

## Step 8: Production Checklist

### 8.1 Security Configuration
- [ ] Strong JWT secrets (use `openssl rand -base64 32`)
- [ ] Secure cookie settings in production
- [ ] CORS configured for your frontend domain only
- [ ] Rate limiting enabled
- [ ] Helmet security headers configured

### 8.2 Database Configuration  
- [ ] PostgreSQL connection established
- [ ] Database migrations applied
- [ ] Proper indexing on User table
- [ ] Backup strategy in place

### 8.3 OAuth Configuration
- [ ] Google OAuth credentials configured
- [ ] Correct callback URLs set
- [ ] OAuth consent screen published (for production)
- [ ] Test users added (for testing mode)

### 8.4 Monitoring
- [ ] Railway logs monitoring
- [ ] Error tracking configured
- [ ] Health check endpoint working
- [ ] Database connection monitoring

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check database URL
railway variables | grep DATABASE_URL

# Test connection
railway run npm run db:studio
```

**2. OAuth Callback Error**  
- Verify callback URL in Google Console matches deployment URL
- Check CORS settings allow your frontend domain
- Ensure OAuth consent screen is properly configured

**3. Prisma Client Issues**
```bash
# Regenerate client
railway run npm run db:generate

# Reset database (CAUTION: destroys data)
railway run npm run db:reset
```

**4. Environment Variables**
```bash
# List all variables
railway variables

# Set missing variables
railway variables set VARIABLE_NAME="value"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile

### Health & Status
- `GET /health` - Application health check

## Additional Resources
- [Railway Documentation](https://docs.railway.app)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)