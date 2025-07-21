/**
 * Utility functions for cookie management
 */

/**
 * Parse cookies from document.cookie string
 */
export const parseCookies = (): Record<string, string> => {
  if (typeof document === 'undefined') return {};
  
  return document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      acc[name] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Check if authentication cookies exist
 */
export const hasAuthCookies = (): boolean => {
  const cookies = parseCookies();
  return !!(cookies.access_token || cookies.refresh_token);
};

/**
 * Get specific cookie value
 */
export const getCookie = (name: string): string | null => {
  const cookies = parseCookies();
  return cookies[name] || null;
};

/**
 * Check if a specific cookie exists
 */
export const hasCookie = (name: string): boolean => {
  const cookies = parseCookies();
  return name in cookies;
};
