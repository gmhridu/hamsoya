/**
 * Client-side application configuration
 * Only includes environment variables that are safe to expose to the client
 */

export const config = {
  // Client-side API Configuration (for UI behavior only)
  api: {
    timeout: parseInt(process.env.NEXT_PUBLIC_AUTH_TIMEOUT || '10000'),
    enableMockApi: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true',
  },

  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },

  // Authentication
  auth: {
    otpExpiryMinutes: parseInt(
      process.env.NEXT_PUBLIC_OTP_EXPIRY_MINUTES || '5'
    ),
    otpResendCooldownSeconds: parseInt(
      process.env.NEXT_PUBLIC_OTP_RESEND_COOLDOWN_SECONDS || '60'
    ),
  },

  // Application
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Hamsoya',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  },
} as const;

/**
 * Validates that all required client-side environment variables are present
 */
export function validateConfig(): void {
  // No required client-side environment variables for now
  // All sensitive API URLs are now handled server-side
  const requiredVars: string[] = [];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0 && config.env.isProduction) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

// Validate configuration on import in production
if (config.env.isProduction) {
  validateConfig();
}
