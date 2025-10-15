'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

interface RealTimeEvent {
  type: string;
  timestamp: string;
  data?: any;
  message?: string;
}

interface UseAdminRealtimeOptions {
  enabled?: boolean;
  onEvent?: (event: RealTimeEvent) => void;
  onError?: (error: Error) => void;
  reconnectInterval?: number;
}

export function useAdminRealtime(options: UseAdminRealtimeOptions = {}) {
  const {
    enabled = true,
    onEvent,
    onError,
    reconnectInterval = 5000,
  } = options;

  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';
  const queryClient = useQueryClient();

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = () => {
    if (!isAdmin || !enabled) return;

    try {
      const eventSource = new EventSource('/api/admin/events');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        console.log('Admin realtime connection established');
      };

      eventSource.onmessage = (event) => {
        try {
          const data: RealTimeEvent = JSON.parse(event.data);

          // Handle different event types
          switch (data.type) {
            case 'connected':
              console.log('Admin realtime connected:', data.message);
              break;

            case 'stats_update':
              // Invalidate dashboard stats to trigger refetch
              queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
              break;

            case 'order_update':
              // Invalidate orders data
              queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'recent-orders'] });
              queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });

              if (data.data?.action === 'created') {
                toast.success('New order received!', {
                  description: `Order ${data.data.order_number} has been placed.`,
                });
              }
              break;

            case 'product_update':
              // Invalidate products data
              queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'top-products'] });
              queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
              break;

            case 'customer_update':
              // Invalidate customers data
              queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'recent-customers'] });
              queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
              break;

            default:
              console.log('Unknown realtime event:', data);
          }

          // Call custom event handler
          onEvent?.(data);

        } catch (error) {
          console.error('Error parsing realtime event:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Admin realtime connection error:', error);
        setIsConnected(false);
        setConnectionError('Connection error');

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < 5) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/5)...`);
            connect();
          }, reconnectInterval * reconnectAttemptsRef.current);
        } else {
          setConnectionError('Max reconnection attempts reached');
          onError?.(new Error('Max reconnection attempts reached'));
        }
      };

    } catch (error) {
      console.error('Failed to establish realtime connection:', error);
      setConnectionError('Failed to connect');
      onError?.(error as Error);
    }
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnected(false);
    setConnectionError(null);
    reconnectAttemptsRef.current = 0;
  };

  const reconnect = () => {
    disconnect();
    setTimeout(connect, 1000);
  };

  useEffect(() => {
    if (isAdmin && enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [isAdmin, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    connectionError,
    reconnect,
    disconnect,
  };
}

// Hook for optimistic updates with rollback
export function useOptimisticUpdate<T>() {
  const queryClient = useQueryClient();
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, T>>(new Map());

  const updateOptimistically = async <TData>(
    queryKey: any[],
    updateFn: (old: TData | undefined) => TData,
    mutationFn: () => Promise<TData>,
    options?: {
      onSuccess?: (data: TData) => void;
      onError?: (error: Error, rollbackData: TData | undefined) => void;
      updateId?: string;
    }
  ) => {
    const updateId = options?.updateId || Math.random().toString(36);

    // Store the previous data for rollback
    const previousData = queryClient.getQueryData<TData>(queryKey);

    // Apply optimistic update
    queryClient.setQueryData(queryKey, updateFn);

    // Track pending update
    setPendingUpdates(prev => new Map(prev.set(updateId, previousData as T)));

    try {
      // Perform the actual mutation
      const result = await mutationFn();

      // Update with real data
      queryClient.setQueryData(queryKey, result);

      // Remove from pending updates
      setPendingUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(updateId);
        return newMap;
      });

      options?.onSuccess?.(result);

      return result;
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(queryKey, previousData);

      // Remove from pending updates
      setPendingUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(updateId);
        return newMap;
      });

      options?.onError?.(error as Error, previousData);

      // Show error toast
      toast.error('Update failed', {
        description: 'The change has been reverted. Please try again.',
        action: {
          label: 'Retry',
          onClick: () => updateOptimistically(queryKey, updateFn, mutationFn, options),
        },
      });

      throw error;
    }
  };

  const hasPendingUpdates = pendingUpdates.size > 0;

  return {
    updateOptimistically,
    hasPendingUpdates,
    pendingUpdatesCount: pendingUpdates.size,
  };
}
