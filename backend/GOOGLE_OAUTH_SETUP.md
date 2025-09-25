# Google OAuth Setup Guide - Chess Academy

## Quick Setup Instructions

### 1. Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" dropdown
   - Click "NEW PROJECT"
   - Project name: `Chess Academy`
   - Click "CREATE"

### 2. Enable APIs

1. **Navigate to APIs & Services**
   - Left sidebar → "APIs & Services" → "Library"
   
2. **Enable Google+ API (Legacy) or People API**
   - Search for "Google+ API" or "People API"
   - Click on it → Click "ENABLE"

### 3. Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - Left sidebar → "APIs & Services" → "Credentials"
   
2. **Create Credentials**
   - Click "+ CREATE CREDENTIALS"
   - Select "OAuth client ID"

3. **Configure OAuth Client**
   - Application type: `Web application`
   - Name: `Chess Academy Backend`
   
4. **Set Authorized Redirect URIs**
   ```
   Development:
   http://localhost:3001/api/auth/google/callback
   
   Production (Railway):
   https://your-railway-app.railway.app/api/auth/google/callback
   ```
   
5. **Save Credentials**
   - Click "CREATE"
   - **IMPORTANT**: Copy and save:
     - Client ID
     - Client secret

### 4. Configure OAuth Consent Screen

1. **Navigate to OAuth Consent Screen**
   - Left sidebar → "APIs & Services" → "OAuth consent screen"

2. **Choose User Type**
   - For development: `External` 
   - For Google Workspace: `Internal`
   - Click "CREATE"

3. **Fill App Information**
   ```
   App name: Chess Academy
   User support email: your-email@example.com
   App logo: (optional, upload chess academy logo)
   App domain: https://your-domain.com (optional)
   Authorized domains: your-domain.com (if you have one)
   Developer contact email: your-email@example.com
   ```

4. **Configure Scopes**
   - Click "ADD OR REMOVE SCOPES"
   - Select:
     - `../auth/userinfo.email`
     - `../auth/userinfo.profile`
   - Click "UPDATE"

5. **Add Test Users (Development Only)**
   - Add email addresses that can test the OAuth flow
   - Include your own email and team members
   - Click "ADD USERS"

6. **Review and Submit**
   - Review all information
   - Click "BACK TO DASHBOARD"

### 5. Environment Variables Setup

#### Development (.env)
```bash
GOOGLE_CLIENT_ID="123456789-abcdefg.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret-here"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"
```

#### Production (Railway)
```bash
railway variables set GOOGLE_CLIENT_ID="123456789-abcdefg.apps.googleusercontent.com"
railway variables set GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret-here"  
railway variables set GOOGLE_CALLBACK_URL="https://your-app.railway.app/api/auth/google/callback"
```

### 6. Frontend Integration

#### React Example
```javascript
// Login with Google button
const handleGoogleLogin = () => {
  const backendUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : 'https://your-backend.railway.app';
    
  window.location.href = `${backendUrl}/api/auth/google`;
};

// Handle OAuth success callback
// In your success page component (e.g., /auth/success)
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Store token
      localStorage.setItem('accessToken', token);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  }, [searchParams]);
  
  return <div>Authenticating...</div>;
}
```

#### HTML/JavaScript Example
```html
<!-- Login Button -->
<button onclick="loginWithGoogle()">Login with Google</button>

<script>
function loginWithGoogle() {
  const backendUrl = 'https://your-backend.railway.app';
  window.location.href = `${backendUrl}/api/auth/google`;
}

// Handle success callback (on /auth/success page)
window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    localStorage.setItem('accessToken', token);
    window.location.href = '/dashboard';
  }
};
</script>
```

### 7. Testing the OAuth Flow

#### Step 1: Start Local Development
```bash
cd /Users/priyasingh/chess-academy/backend
npm run dev
```

#### Step 2: Test OAuth Initiation
Visit: `http://localhost:3001/api/auth/google`

Expected flow:
1. Redirects to Google login
2. User authenticates with Google
3. Google redirects back to your callback URL
4. Backend processes OAuth data
5. User is redirected to frontend with token

#### Step 3: Manual Testing
```bash
# 1. Test health endpoint
curl http://localhost:3001/health

# 2. Visit OAuth URL in browser
open http://localhost:3001/api/auth/google

# 3. Check logs for any errors
tail -f logs/app.log
```

### 8. Production Deployment

#### Update Callback URLs
1. Deploy to Railway: `railway up`
2. Get Railway domain: `railway domain`
3. Update Google OAuth credentials:
   - Go to Google Console → Credentials
   - Edit your OAuth client
   - Add production callback URL:
     `https://your-app.railway.app/api/auth/google/callback`

#### Publish OAuth Consent Screen (Optional)
For public users (not just test users):
1. Go to OAuth consent screen
2. Click "PUBLISH APP"  
3. Submit for verification (may take days/weeks)

### 9. Common Issues & Solutions

#### Issue: "Error 400: redirect_uri_mismatch"
**Solution**: 
- Check callback URL in Google Console exactly matches your backend URL
- Ensure no trailing slashes
- Check HTTP vs HTTPS

#### Issue: "This app isn't verified"
**Solutions**:
- For development: Click "Advanced" → "Go to Chess Academy (unsafe)"
- For production: Submit app for verification in Google Console

#### Issue: "Access blocked: This app's request is invalid"
**Solution**: 
- Check OAuth consent screen is properly configured
- Ensure all required fields are filled
- Add test users if in development mode

#### Issue: OAuth works locally but not in production
**Solution**:
- Verify Railway environment variables are set correctly
- Check Railway logs for errors: `railway logs`
- Ensure production callback URL is added to Google Console

### 10. Security Best Practices

1. **Environment Variables**
   - Never commit OAuth secrets to version control
   - Use different credentials for development/production
   - Rotate secrets regularly

2. **Callback URLs**  
   - Only add necessary callback URLs
   - Use HTTPS in production
   - Validate redirect domains in your backend

3. **Scopes**
   - Only request necessary scopes (email, profile)
   - Don't request excessive permissions

4. **Error Handling**
   - Don't expose sensitive error messages
   - Log OAuth errors for debugging
   - Handle edge cases (denied permissions, network errors)

### 11. API Response Examples

#### Successful OAuth Response
```json
{
  "success": true,
  "message": "Authentication successful", 
  "data": {
    "user": {
      "id": "cuid123",
      "email": "user@gmail.com",
      "username": "user123", 
      "displayName": "John Doe",
      "avatar": "https://lh3.googleusercontent.com/...",
      "provider": "google",
      "emailVerified": true
    },
    "accessToken": "jwt-token-here"
  }
}
```

#### OAuth Error Response  
```json
{
  "success": false,
  "message": "Authentication failed",
  "error": "Email not provided by Google"
}
```

---

## Quick Reference

### Environment Variables
```bash
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret" 
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"
```

### API Endpoints
```
GET /api/auth/google - Initiate OAuth
GET /api/auth/google/callback - OAuth callback
```

### Frontend Redirect URLs  
```
Success: https://frontend.com/auth/success?token=jwt-token
Error: https://frontend.com/auth/error?message=error-message
```