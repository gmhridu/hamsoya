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
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            fontSize: '14px',
            padding: '16px',
          },
          className: 'seller-toast',
          duration: 4000,
        }}
        position="top-right"
        offset={16}
        visibleToasts={5}
        theme="light"
      />
    </ReduxProvider>
  );
};

export default Providers;
