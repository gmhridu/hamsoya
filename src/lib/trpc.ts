import { httpLink, loggerLink, type TRPCLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import { toastService } from './toast-service';

// For now, use any type until we can properly import the backend router type
// In a real monorepo setup, this would be imported from a shared package
type AppRouter = any;

// Create the tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Get the API URL from environment variables
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return '';
  }

  // SSR should use absolute URL
  if (process.env.NEXT_PUBLIC_TRPC_URL) {
    return process.env.NEXT_PUBLIC_TRPC_URL;
  }

  // Fallback for development
  return 'http://localhost:5000/trpc';
}

// tRPC client configuration for React Query
export const trpcClientConfig = {
  transformer: superjson,
  links: [
    loggerLink({
      enabled: opts =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    // Error handling link
    (runtime: any) => {
      return ({ next, op }: any) => {
        return next(op).catch((error: any) => {
          console.error('[TRPC Error]', error);

          // Handle specific error types
          if (error.data?.code === 'UNAUTHORIZED') {
            toastService.showOnce('auth-error', () =>
              toastService.error('Please log in to continue')
            );
          } else if (error.data?.code === 'FORBIDDEN') {
            toastService.showOnce('permission-error', () =>
              toastService.error('You do not have permission to access this resource')
            );
          } else if (error.data?.code === 'NOT_FOUND') {
            toastService.showOnce('not-found-error', () =>
              toastService.warning('The requested resource was not found')
            );
          } else if (error.data?.code === 'INTERNAL_SERVER_ERROR') {
            toastService.showOnce('server-error', () =>
              toastService.error('Server error. Please try again later.')
            );
          } else {
            // Generic error handling
            toastService.showOnce(`trpc-error-${op.type}-${op.path}`, () =>
              toastService.error(`Operation failed: ${op.path}`)
            );
          }

          throw error;
        });
      };
    },
    httpLink({
      url: `${getBaseUrl()}/trpc`,
      headers() {
        return {
          'Content-Type': 'application/json',
        };
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
          // Disable caching for cart and bookmarks to prevent stale data
          cache: 'no-store',
        });
      },
    }),
  ],
};

// Type helpers
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
