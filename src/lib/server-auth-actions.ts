/**
 * Server Authentication Actions
 * Provides instant server-side authentication and redirects for ChatGPT-style performance
 * Separates server-side logic from client-side form handling
 */

'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { API_CONFIG } from './api-config';
import { getUserFriendlyMessage } from './error-messages';

export interface LoginCredentials {
  email: string;
  password: string;
  redirectTo?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  profile_image_url?: string;
  redirectTo?: string;
}

/**
 * Get role-based redirect URL with security validation
 */
function getRoleBasedRedirectUrl(role: string, requestedRedirect?: string): string {
  // Validate requested redirect for security
  if (requestedRedirect && requestedRedirect !== '/login') {
    // Basic security check - ensure it's a relative path
    if (requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')) {
      // Additional role-based validation
      if (role === 'ADMIN' && requestedRedirect.startsWith('/admin')) {
        return requestedRedirect;
      } else if (role !== 'ADMIN' && !requestedRedirect.startsWith('/admin')) {
        return requestedRedirect;
      }
    }
  }

  // Default role-based redirects
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'SELLER':
      return '/dashboard';
    default:
      return '/';
  }
}

/**
 * Extract and set authentication cookies from response
 */
async function setAuthCookies(response: Response): Promise<void> {
  const setCookieHeaders = response.headers.getSetCookie?.() || [];
  if (setCookieHeaders.length === 0) {
    const singleSetCookie = response.headers.get('set-cookie');
    if (singleSetCookie) {
      setCookieHeaders.push(singleSetCookie);
    }
  }

  const cookieStore = await cookies();
  for (const cookieHeader of setCookieHeaders) {
    const [nameValue] = cookieHeader.split(';');
    const [name, value] = nameValue.split('=');
    if (name && value) {
      cookieStore.set(name.trim(), value.trim(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
    }
  }
}

/**
 * Server action for instant login with server-side redirects
 */
export async function serverLoginAction(credentials: LoginCredentials): Promise<never> {
  const { email, password, redirectTo } = credentials;

  if (!email || !password) {
    const errorMessage = getUserFriendlyMessage('Please enter both email and password');
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }

  try {
    console.log('[SERVER-LOGIN] Starting login process for:', email);

    const response = await fetch(API_CONFIG.backend.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),

    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const rawErrorMessage = errorData.error || errorData.message || 'Login failed';
      const errorMessage = getUserFriendlyMessage(rawErrorMessage);
      console.log('[SERVER-LOGIN] Login failed:', errorMessage);
      redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    }

    // Set authentication cookies
    await setAuthCookies(response);

    // Parse response data
    const data = await response.json();
    if (data.success && data.data?.user) {
      const user = data.data.user;
      const finalRedirectUrl = getRoleBasedRedirectUrl(user.role, redirectTo);
      console.log(`[SERVER-LOGIN] Login successful, redirecting ${user.role} -> ${finalRedirectUrl}`);
      redirect(finalRedirectUrl);
    }

    console.log('[SERVER-LOGIN] No user data, redirecting to home');
    redirect('/');
  } catch (error) {
    // ✅ Handle intentional Next.js redirect errors properly
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    console.error('[SERVER-LOGIN] Unexpected error:', error);
    const errorMessage = getUserFriendlyMessage(error);
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }
}

/**
 * Server action for user registration with proper redirect handling
 */
export async function serverRegisterAction(credentials: RegisterCredentials): Promise<never> {
  const { name, email, password, phone_number, profile_image_url } = credentials;

  if (!name || !email || !password) {
    const errorMessage = getUserFriendlyMessage('Please fill in all required fields: name, email, and password');
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }

  try {
    const response = await fetch(API_CONFIG.backend.auth.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone_number, profile_image_url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const rawErrorMessage = errorData.error || errorData.message || 'Registration failed';
      const errorMessage = getUserFriendlyMessage(rawErrorMessage);
      redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    }

    const data = await response.json();

    if (data.success) {
      const verifyUrl = `/verify-email?email=${encodeURIComponent(email)}`;
      console.log(`[SERVER-REGISTER] Success -> redirecting to: ${verifyUrl}`);
      redirect(verifyUrl);
    } else {
      const rawErrorMessage = data.error || data.message || 'Registration failed';
      const errorMessage = getUserFriendlyMessage(rawErrorMessage);
      redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    }
  } catch (error) {
    // ✅ Handle Next.js redirect correctly
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    console.error('[SERVER-REGISTER] Unexpected error:', error);
    const errorMessage = getUserFriendlyMessage(error);
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }
}

/**
 * FormData wrapper for login
 */
export async function serverLoginFormAction(formData: FormData): Promise<never> {
  try {
    const credentials: LoginCredentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirectTo: (formData.get('redirectTo') as string) || undefined,
    };

    return await serverLoginAction(credentials);
  } catch (error) {
    // ✅ Re-throw intentional redirect errors
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    console.error('[SERVER-LOGIN-FORM] Unexpected error:', error);
    const errorMessage = getUserFriendlyMessage(error);
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }
}

/**
 * FormData wrapper for registration
 */
export async function serverRegisterFormAction(formData: FormData): Promise<never> {
  try {
    const credentials: RegisterCredentials = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone_number: (formData.get('phone_number') as string) || undefined,
      profile_image_url: (formData.get('profile_image_url') as string) || undefined,
      redirectTo: (formData.get('redirectTo') as string) || undefined,
    };

    return await serverRegisterAction(credentials);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    console.error('[SERVER-REGISTER-FORM] Unexpected error:', error);
    const errorMessage = getUserFriendlyMessage(error);
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }
}

/**
 * Instant role-based redirect using JWT token
 */
export async function instantRoleBasedRedirect(redirectTo?: string): Promise<never> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (accessToken) {
      const { decodeJWTPayload } = await import('@/lib/server-jwt-decoder');
      const payload = decodeJWTPayload(accessToken);

      if (payload && payload.role) {
        const finalRedirectUrl = getRoleBasedRedirectUrl(payload.role, redirectTo);
        console.log(`[INSTANT-REDIRECT] ${payload.role} user -> ${finalRedirectUrl}`);
        redirect(finalRedirectUrl);
      }
    }

    redirect('/login');
  } catch (error) {
    // ✅ Allow proper redirect
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    console.error('[INSTANT-REDIRECT] Unexpected error:', error);
    // For instant redirect, we don't show error messages to user
    redirect('/login');
  }
}
