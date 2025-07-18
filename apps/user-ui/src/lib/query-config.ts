import { QueryClient } from '@tanstack/react-query';

export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
    status: ['auth', 'status'] as const,
    refreshToken: ['auth', 'refresh-token'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (filters?: any) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
  },
} as const;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60 * 24, // 24 hours - must match or exceed persistence maxAge
        retry: (failureCount, error: any) => {
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
        onError: (error: any) => {
          console.error('Mutation error:', error);
        },
      },
    },
  });

export const queryConfig = {
  cacheTime: {
    auth: 1000 * 60 * 15, // 15 minutes
    static: 1000 * 60 * 60 * 24, // 24 hours
    dynamic: 1000 * 60 * 5, // 5 minutes
  },
  staleTime: {
    auth: 1000 * 60 * 5, // 5 minutes
    static: 1000 * 60 * 60, // 1 hour
    dynamic: 1000 * 60, // 1 minute
  },
} as const;
