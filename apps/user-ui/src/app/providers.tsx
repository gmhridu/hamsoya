'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { ReduxProvider } from '../providers/ReduxProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider>
      {children}
      <Toaster
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
    </ReduxProvider>
  );
};

export default Providers;
