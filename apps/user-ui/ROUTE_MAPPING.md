# Authentication Route Mapping

This document shows the complete mapping between frontend API routes and backend endpoints.

## 🔄 Route Mapping Table

| Frontend Route | Backend Endpoint | Method | Description | Status |
|---------------|------------------|--------|-------------|--------|
| `/api/auth/register` | `/user-registration` | POST | User registration | ✅ Fixed |
| `/api/auth/verify-user` | `/verify-user` | POST | Verify user after registration | ✅ Fixed |
| `/api/auth/login` | `/login-user` | POST | User login | ✅ Fixed |
| `/api/auth/refresh-token` | `/refresh-token-user` | POST | Refresh access token | ✅ Fixed |
| `/api/auth/user` | `/logged-in-user` | GET | Get current user | ✅ Fixed |
| `/api/auth/forgot-password` | `/forgot-user-password` | POST | Forgot password | ✅ Fixed |
| `/api/auth/reset-password` | `/reset-user-password` | POST | Reset password | ✅ Fixed |
| `/api/auth/verify-forgot-password-otp` | `/verify-forgot-password-otp` | POST | Verify forgot password OTP | ✅ Fixed |
| `/api/auth/resend-otp` | `/forgot-user-password` | POST | Resend OTP (reuses forgot password) | ✅ Fixed |
| `/api/auth/logout` | N/A | POST | Logout (clears cookies) | ✅ Fixed |

## 📋 Backend Routes (from auth.routes.ts)

```typescript
// User registration route
router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser);
router.post('/login-user', loginUser);
router.post('/refresh-token-user', refreshToken);
router.get('/logged-in-user', isAuthenticated, getUser);
router.post('/forgot-user-password', userForgotPassword);
router.post('/reset-user-password', resetUserPassword);
router.post('/verify-forgot-password-otp', verifyUserForgotPassword);
```

## 🎯 Frontend API Routes

### Registration Flow
1. **POST `/api/auth/register`** → **POST `/user-registration`**
   - Creates new user account
   - Sends OTP to email

2. **POST `/api/auth/verify-user`** → **POST `/verify-user`**
   - Verifies OTP and activates account
   - Sets authentication cookies

### Login Flow
3. **POST `/api/auth/login`** → **POST `/login-user`**
   - Authenticates user
   - Sets HTTP-only cookies (access_token, refresh_token)

4. **GET `/api/auth/user`** → **GET `/logged-in-user`**
   - Gets current authenticated user
   - Requires authentication middleware

### Token Management
5. **POST `/api/auth/refresh-token`** → **POST `/refresh-token-user`**
   - Refreshes access token using refresh token cookie
   - Updates access_token cookie

6. **POST `/api/auth/logout`** → **N/A**
   - Clears HTTP-only cookies
   - No backend endpoint needed

### Password Reset Flow
7. **POST `/api/auth/forgot-password`** → **POST `/forgot-user-password`**
   - Sends password reset OTP to email

8. **POST `/api/auth/verify-forgot-password-otp`** → **POST `/verify-forgot-password-otp`**
   - Verifies password reset OTP

9. **POST `/api/auth/reset-password`** → **POST `/reset-user-password`**
   - Resets password with OTP verification

10. **POST `/api/auth/resend-otp`** → **POST `/forgot-user-password`**
    - Resends OTP (reuses forgot password endpoint)

## 🔧 Implementation Details

### Cookie Management
- **Cookie Names**: `access_token`, `refresh_token` (matching backend expectations)
- **Settings**: `httpOnly: true`, `sameSite: 'lax'`, `secure: true` (production)
- **Expiry**: Access token (15 min), Refresh token (7 days)

### Error Handling
- Consistent error response format across all routes
- Proper HTTP status codes
- Detailed error messages for debugging

### Authentication Flow
```
1. Register → Send OTP → Verify OTP → Account Active
2. Login → Set Cookies → Access Protected Routes
3. Token Expires → Auto Refresh → Continue Session
4. Logout → Clear Cookies → Redirect to Login
```

### Password Reset Flow
```
1. Forgot Password → Send OTP → Verify OTP → Reset Password
2. Resend OTP → Reuse Forgot Password Endpoint
```

## ✅ Fixes Applied

### Route Mismatches Fixed
- ❌ `/signup` → ✅ `/register` (maps to `/user-registration`)
- ❌ `/verify-otp` → ✅ `/verify-user` (maps to `/verify-user`)
- ✅ Cookie names updated to match backend expectations
- ✅ All API routes properly forward cookies to backend
- ✅ Consistent error handling across all routes

### Authentication Improvements
- ✅ HTTP-only cookies for security
- ✅ Automatic cookie forwarding to backend
- ✅ Proper token refresh mechanism
- ✅ TanStack Query integration for state management

## 🧪 Testing

To test the route mappings:

1. **Registration**: `POST /api/auth/register` with `{name, email, password}`
2. **Verification**: `POST /api/auth/verify-user` with `{email, otp, password, name}`
3. **Login**: `POST /api/auth/login` with `{email, password}`
4. **Get User**: `GET /api/auth/user` (with cookies)
5. **Refresh**: `POST /api/auth/refresh-token` (with cookies)
6. **Logout**: `POST /api/auth/logout`

All routes now properly map to the correct backend endpoints and handle authentication cookies correctly.
