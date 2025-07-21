import { Response } from 'express';

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options?: {
    maxAge?: number;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }
) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Default options
  const defaultMaxAge =
    name === 'access_token'
      ? 15 * 60 * 1000 // 15 minutes for access token
      : 7 * 24 * 60 * 60 * 1000; // 7 days for refresh token

  res.cookie(name, value, {
    httpOnly: true,
    secure: !isDevelopment, // false in development, true in production
    sameSite: isDevelopment ? 'lax' : 'none', // lax for development, none for production
    maxAge: options?.maxAge || defaultMaxAge,
    path: '/',
    ...options,
  });
};
