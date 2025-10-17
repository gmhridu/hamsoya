# Environment Variables Setup for Hamsoya Frontend

This document explains how to configure environment variables for the Hamsoya frontend application.

## Required Environment Variables

### Production (Vercel)

Set these environment variables in your Vercel project settings:

1. **NEXT_PUBLIC_API_URL**
   - Description: Backend API URL for making API calls
   - Value: `https://hamsoya-backend-prod.ahmedriazbepari.workers.dev/api`
   - Used for: Authentication, data fetching, and all backend communication

2. **NEXT_PUBLIC_APP_URL**
   - Description: Frontend application URL
   - Value: `https://hamsoya.vercel.app/api`
   - Used for: Frontend API routes (Next.js API routes)

### Development (Local)

Create a `.env.local` file in the `apps/frontend` directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000/api
```

## How to Set Environment Variables in Vercel

### Option 1: Using Vercel Dashboard

1. Go to your project: https://vercel.com/dashboard
2. Select your project (hamsoya)
3. Click on **Settings** tab
4. Click on **Environment Variables** in the sidebar
5. Add the following variables:
   - **Variable Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://hamsoya-backend-prod.ahmedriazbepari.workers.dev/api`
   - **Environments:** Production, Preview, Development (select all)
   - Click **Save**
   
   - **Variable Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://hamsoya.vercel.app/api`
   - **Environments:** Production, Preview, Development (select all)
   - Click **Save**

6. **Redeploy** your application for the changes to take effect

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Link your project (run in apps/frontend directory)
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, enter: https://hamsoya-backend-prod.ahmedriazbepari.workers.dev/api

vercel env add NEXT_PUBLIC_APP_URL production
# When prompted, enter: https://hamsoya.vercel.app/api

# Redeploy
vercel --prod
```

## Verification

After setting the environment variables and redeploying:

1. Visit your frontend: https://hamsoya.vercel.app
2. Open browser DevTools (F12)
3. Go to Console tab
4. Check the network requests - they should be pointing to:
   - Backend API: `https://hamsoya-backend-prod.ahmedriazbepari.workers.dev/api`
5. Try to login or register - it should now work without the DATABASE_URL error

## Troubleshooting

### Issue: Still getting "DATABASE_URL environment variable is required"

**Solution:**
1. Verify environment variables are set in Vercel
2. Redeploy the application (don't just save settings)
3. Clear browser cache and cookies
4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: CORS errors

**Solution:**
The backend is already configured to allow requests from `https://hamsoya.vercel.app`. If you still get CORS errors:
1. Check that you're using the correct backend URL
2. Verify cookies are being sent with credentials: true

### Issue: API calls failing

**Solution:**
1. Check browser DevTools Network tab to see actual API URLs being called
2. Verify the URL format is correct (should not have double `/api/api/`)
3. Check backend logs in Cloudflare Workers dashboard

## Backend Configuration

The backend is already configured with:
- **Worker URL:** `https://hamsoya-backend-prod.ahmedriazbepari.workers.dev`
- **Environment:** production
- **Secrets:** DATABASE_URL (already set)
- **Allowed Origins:** `https://hamsoya.vercel.app`

## Notes

- All environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Variables without `NEXT_PUBLIC_` are only available server-side
- After changing environment variables in Vercel, you MUST redeploy for changes to take effect
- The backend URL includes `/api` at the end because that's the API route prefix