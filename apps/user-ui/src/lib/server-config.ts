export const serverConfig = {
  // Backend API Configuration
  api: {
    authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:5001/api',
    timeout: parseInt(process.env.AUTH_SERVICE_TIMEOUT || '10000'),
  },

  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
  },
} as const;

/**
 * Validates that all required server-side environment variables are present
 */
export function validateServerConfig(): void {
  const requiredVars = ['AUTH_SERVICE_URL'];

  // Only require JWT_SECRET and COOKIE_SECRET in production
  if (serverConfig.env.isProduction) {
    requiredVars.push('JWT_SECRET', 'COOKIE_SECRET');
  }

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `Missing server environment variables: ${missingVars.join(', ')}`
    );

    if (serverConfig.env.isProduction) {
      throw new Error(
        `Missing required server environment variables: ${missingVars.join(
          ', '
        )}`
      );
    }
  }
}

// Validate server configuration on import
validateServerConfig();
