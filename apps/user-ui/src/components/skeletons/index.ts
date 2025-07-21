// Skeleton components for eliminating white screen flashes
export { HomePageSkeleton } from './HomePageSkeleton';
export { AuthPageSkeleton, MinimalAuthPageSkeleton } from './AuthPageSkeleton';

// Re-export enhanced auth skeleton components
export {
  AuthSkeleton,
  AuthAvatarSkeleton,
  AuthButtonsSkeleton,
  NavigationSkeleton,
  SmartAuthSkeleton,
} from '../auth/AuthSkeleton';

// Transition components
export { 
  PostLoginTransition,
  usePostLoginNavigation,
  TransitionLoadingOverlay,
  SmoothRouter,
} from '../transitions/PostLoginTransition';

// Enhanced route guards
export {
  EnhancedAuthRouteGuard,
  withEnhancedAuthPageGuard,
  withEnhancedProtectedRoute,
  useEnhancedAuthRedirect,
} from '../auth/EnhancedAuthRouteGuard';
