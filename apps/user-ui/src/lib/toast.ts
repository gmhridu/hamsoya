import { toast as sonnerToast } from 'sonner';

/**
 * Custom toast utility with brand-consistent styling
 */
export const toast = {
  /**
   * Success toast with brand gradient styling
   */
  success: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      style: {
        background: 'linear-gradient(135deg, #1E3A8A 0%, #D4AF37 100%)',
        color: 'white',
        border: '1px solid #1E3A8A',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.2), 0 4px 6px -2px rgba(30, 58, 138, 0.1)',
        backdropFilter: 'blur(8px)',
      },
      className: 'font-medium text-sm',
    });
  },

  /**
   * Error toast with red styling
   */
  error: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      style: {
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.1), 0 4px 6px -2px rgba(220, 38, 38, 0.05)',
        backdropFilter: 'blur(8px)',
      },
      className: 'font-medium text-sm',
    });
  },

  /**
   * Info toast with brand primary styling
   */
  info: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      style: {
        background: '#eff6ff',
        color: '#1E3A8A',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05)',
        backdropFilter: 'blur(8px)',
      },
      className: 'font-medium text-sm',
    });
  },

  /**
   * Warning toast with gold/amber styling
   */
  warning: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      style: {
        background: '#fffbeb',
        color: '#D4AF37',
        border: '1px solid #fed7aa',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.1), 0 4px 6px -2px rgba(212, 175, 55, 0.05)',
        backdropFilter: 'blur(8px)',
      },
      className: 'font-medium text-sm',
    });
  },

  /**
   * Loading toast for async operations
   */
  loading: (message: string, options?: { description?: string }) => {
    return sonnerToast.loading(message, {
      description: options?.description,
      style: {
        background: 'white',
        color: '#1f2937',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(8px)',
      },
      className: 'font-medium text-sm',
    });
  },

  /**
   * Promise toast for handling async operations with automatic state updates
   */
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
      description?: string;
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
      description: options.description,
    });
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    return sonnerToast.dismiss();
  },
};
