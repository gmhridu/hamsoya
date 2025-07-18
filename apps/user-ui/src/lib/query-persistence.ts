'use client';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const createPersister = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return createAsyncStoragePersister({
    storage: window.localStorage,
    key: 'hamsoya-query-cache',
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });
};

export const persistenceOptions = {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  buster: '1.0.0', // Increment to invalidate all cached data
};

export const shouldDehydrateQuery = (query: any) => {
  // Only persist successful queries
  if (query.state.status !== 'success') {
    return false;
  }

  // Don't persist auth queries that might contain sensitive data
  const queryKey = query.queryKey;
  if (Array.isArray(queryKey) && queryKey[0] === 'auth') {
    // Only persist user profile data, not session tokens
    return queryKey[1] === 'user';
  }

  return true;
};

export const shouldDehydrateMutation = () => {
  // Don't persist any mutations
  return false;
};
