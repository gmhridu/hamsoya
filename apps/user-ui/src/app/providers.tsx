'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { createQueryClient } from '../lib/query-config';
import {
  createPersister,
  persistenceOptions,
  shouldDehydrateMutation,
  shouldDehydrateQuery,
} from '../lib/query-persistence';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createQueryClient());
  const [persister] = useState(() => createPersister());
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const onPersistSuccess = () => {
    console.log('Query cache restored successfully');
  };

  const onPersistError = () => {
    console.error('Failed to restore query cache');
  };

  if (!persister || !isClient) {
    // Fallback for SSR or when localStorage is not available
    return (
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={true}
          toastOptions={{
            style: {
              background: 'white',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow:
                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(8px)',
            },
            className: 'font-medium text-sm',
            duration: 4000,
          }}
          theme="light"
        />
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        ...persistenceOptions,
        dehydrateOptions: {
          shouldDehydrateQuery,
          shouldDehydrateMutation,
        },
      }}
      onSuccess={onPersistSuccess}
      onError={onPersistError}
    >
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={true}
        toastOptions={{
          style: {
            background: 'white',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(8px)',
          },
          className: 'font-medium text-sm',
          duration: 4000,
        }}
        theme="light"
      />
    </PersistQueryClientProvider>
  );
};

export default Providers;
