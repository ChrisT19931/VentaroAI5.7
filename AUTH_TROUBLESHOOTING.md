# 🔧 Authentication Troubleshooting Guide

## Quick Diagnosis

If sign up/sign in isn't working, follow these steps in order:

### 1. Check Auth System Health
Visit: `http://localhost:3000/api/health/auth` (or your deployed URL)

This will show you exactly what's wrong with your authentication system.

### 2. Common Issues & Solutions

#### ❌ "Invalid email or password" (but credentials are correct)

**Cause**: Database connection or environment variable issues

**Solution**:
```bash
# Check your .env.local file has:
NEXTAUTH_SECRET=your-secret-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

#### ❌ "Authentication system error"

**Cause**: Missing NEXTAUTH_SECRET or NextAuth configuration issue

**Solution**:
```bash
# Generate a new secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local:
NEXTAUTH_SECRET=generated-secret-here
```

#### ❌ "Account configuration error"

**Cause**: User exists but password hash is missing

**Solution**: Run the database setup script to fix user records:
```bash
node scripts/setup-supabase-database.js
```

#### ❌ Sign up creates account but auto-login fails

**Cause**: Session/token synchronization issue

**Solution**: The system will redirect to sign in page - this is normal. Users can then sign in manually.

### 3. Environment Variable Checklist

**Required for Authentication**:
- ✅ `NEXTAUTH_SECRET` - Must be set and not empty
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Must be your actual Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Must be your actual anon key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Must be your actual service role key

**Check for Placeholder Values**:
- ❌ `https://supabase.co` (placeholder)
- ❌ `https://xyzcompany.supabase.co` (placeholder)
- ❌ `your-project-url` (placeholder)
- ❌ `EXAMPLE_KEY` (placeholder)

### 4. Database Setup

If you see "relation does not exist" errors:

```bash
# Run the database setup:
node scripts/setup-supabase-database.js

# Or manually run the SQL:
# Copy contents of scripts/setup-supabase-tables.sql
# Paste into Supabase SQL editor and run
```

### 5. Development vs Production

**Local Development**:
- Uses in-memory fallback if Supabase isn't configured
- Check browser console for detailed error messages
- Admin user: `admin@ventaro.ai` / `admin123`

**Production (Vercel)**:
- Must have all environment variables set in Vercel dashboard
- Redeploy after updating environment variables
- Check Vercel function logs for errors

### 6. Testing Authentication

**Test Sign Up**:
1. Go to `/signup`
2. Use a new email address
3. Password must have: uppercase, lowercase, number, 6+ characters
4. Check browser console for error messages

**Test Sign In**:
1. Go to `/signin`
2. Use existing credentials
3. Check browser console for detailed error messages

**Quick Test Users** (Development only):
- Admin: `admin@ventaro.ai` / `admin123`
- Test: `test@example.com` / `password123`

### 7. Advanced Debugging

**Enable Debug Mode**:
Set `NODE_ENV=development` to see detailed NextAuth logs in console.

**Check Network Tab**:
1. Open browser dev tools
2. Go to Network tab
3. Try to sign in
4. Look for failed requests to `/api/auth/*`

**Check Server Logs**:
- Local: Check terminal where `npm run dev` is running
- Vercel: Check function logs in Vercel dashboard

### 8. Emergency Reset

If everything is broken:

```bash
# 1. Clear all auth-related browser data
# In Chrome: Dev Tools > Application > Storage > Clear site data

# 2. Restart development server
npm run dev

# 3. Try creating a new user with a different email

# 4. If still broken, check the auth health endpoint:
curl http://localhost:3000/api/health/auth
```

### 9. Contact Support

If none of these steps work, provide:
1. Output from `/api/health/auth`
2. Browser console errors
3. Your environment setup (without sharing actual keys)
4. Steps you've already tried

## Success Indicators

✅ **Sign Up Working**:
- Creates user account
- Shows success message
- Redirects to my-account page

✅ **Sign In Working**:
- Accepts valid credentials
- Shows welcome message
- Redirects to my-account page
- User can access protected pages

✅ **System Health**:
- `/api/health/auth` shows "healthy" status
- All critical checks passing
- No error recommendations 