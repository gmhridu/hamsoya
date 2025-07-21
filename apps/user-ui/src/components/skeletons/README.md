# Skeleton Loading System

This directory contains a comprehensive skeleton loading system designed to eliminate white screen flashes during authentication flows and route transitions in the Hamsoya application.

## Overview

The skeleton loading system provides smooth, branded loading states that match the actual page layouts, ensuring users never see jarring white screens during:

1. **Post-Login Redirects**: After successful login while navigating to home page
2. **Authentication Route Protection**: When authenticated users navigate to auth pages
3. **User Button Loading**: During authentication state checks
4. **Route Transitions**: Between different pages and states

## Components

### Core Skeleton Components

#### `HomePageSkeleton.tsx`
- Comprehensive skeleton that matches the home page layout
- Includes skeletons for: HeroSlider, ProductCategories, PreOrderSpotlight, WhyChooseUs, SocialProof, Newsletter, Footer
- Used during post-login redirects and home page loading

#### `AuthPageSkeleton.tsx`
- Authentication page skeleton for login/signup/forgot-password pages
- Matches auth page design with branded gradients and glass-morphism effects
- Includes `MinimalAuthPageSkeleton` for quick transitions

#### `AuthSkeleton.tsx` (Enhanced)
- Enhanced user button and authentication component skeletons
- `AuthAvatarSkeleton`: Matches UserAvatar design exactly with loading spinner
- `AuthButtonsSkeleton`: Skeleton for sign in/sign up buttons
- `SmartAuthSkeleton`: Adaptive skeleton based on expected auth state

### Transition Components

#### `PostLoginTransition.tsx`
- Manages smooth transitions after successful login
- Shows home page skeleton during navigation
- Uses ViewTransition API for smooth animations
- Includes hooks: `usePostLoginNavigation`, `TransitionLoadingOverlay`

#### `EnhancedAuthRouteGuard.tsx`
- Enhanced route guard with skeleton loading states
- Prevents white screens during authentication checks
- HOCs: `withEnhancedAuthPageGuard`, `withEnhancedProtectedRoute`
- Hook: `useEnhancedAuthRedirect`

#### `LoadingStateManager.tsx`
- Global loading state manager for the entire application
- Manages skeleton states during authentication flows
- Handles route transitions and authentication state changes
- HOC: `withLoadingStateManager`

## Usage Examples

### Basic Skeleton Usage

```tsx
import { HomePageSkeleton, AuthPageSkeleton } from '../skeletons';

// Show home page skeleton during loading
<HomePageSkeleton />

// Show auth page skeleton with specific variant
<AuthPageSkeleton variant="login" />
```

### Enhanced Route Guards

```tsx
import { withEnhancedAuthPageGuard } from '../skeletons';

// Wrap auth pages with enhanced guard
const LoginPage = withEnhancedAuthPageGuard(LoginPageContent, 'login');
const SignupPage = withEnhancedAuthPageGuard(SignupPageContent, 'signup');
```

### Post-Login Transitions

```tsx
import { usePostLoginNavigation } from '../skeletons';

const { isNavigating, navigateToHome } = usePostLoginNavigation();

// Navigate with skeleton loading
await navigateToHome();
```

### Loading State Management

```tsx
import { LoadingStateManager, useLoadingState } from '../skeletons';

// Wrap entire app sections
<LoadingStateManager>
  <YourContent />
</LoadingStateManager>

// Use loading state hook
const { isLoading, showLoading, hideLoading } = useLoadingState();
```

## Design Principles

### 1. **Visual Consistency**
- All skeletons match the actual component designs
- Uses brand colors and styling from the design system
- Maintains proper spacing and layout structure

### 2. **Smooth Transitions**
- ViewTransition API integration for modern browsers
- Graceful fallbacks for older browsers
- No jarring layout shifts or flashes

### 3. **Performance Optimized**
- Lightweight skeleton components
- Efficient state management
- Minimal re-renders during transitions

### 4. **Accessibility**
- Proper ARIA labels for loading states
- Screen reader friendly loading messages
- Keyboard navigation support

## Integration Points

### 1. **Root Layout** (`app/layout.tsx`)
```tsx
<LoadingStateManager>
  <ConditionalHeader />
  {children}
</LoadingStateManager>
```

### 2. **Authentication Pages**
- Login: `withEnhancedAuthPageGuard(LoginPageContent, 'login')`
- Signup: `withEnhancedAuthPageGuard(SignupPageContent, 'signup')`

### 3. **Authentication State Manager**
- Enhanced `AuthSkeleton` components
- Smart loading states based on auth status

### 4. **Middleware Integration**
- Works with Next.js middleware for route protection
- Handles server-side authentication checks

## Configuration

### Skeleton Variants
- `login`: Blue gradient with login-specific styling
- `signup`: Primary gradient with signup-specific styling  
- `forgot-password`: Primary gradient with reset-specific styling

### Transition Types
- `auth`: Shows authentication page skeleton
- `home`: Shows home page skeleton
- `minimal`: Shows minimal loading state

### Loading States
- `isLoading`: Component-level loading
- `isNavigating`: Route transition loading
- `isRedirecting`: Authentication redirect loading

## Best Practices

1. **Always use skeleton loaders** instead of blank loading states
2. **Match skeleton structure** to actual component layouts
3. **Use ViewTransition API** for smooth animations when available
4. **Provide fallbacks** for older browsers
5. **Keep skeletons lightweight** to avoid performance issues
6. **Test on slow connections** to ensure smooth experience

## Browser Support

- **Modern browsers**: Full ViewTransition API support
- **Older browsers**: Graceful fallbacks with standard transitions
- **Mobile**: Optimized for touch interactions and smaller screens

## Performance Considerations

- Skeleton components are optimized for fast rendering
- Uses CSS animations instead of JavaScript where possible
- Minimal bundle size impact
- Efficient state management with Redux

## Future Enhancements

- [ ] Add more granular skeleton components for specific sections
- [ ] Implement progressive loading for large pages
- [ ] Add customizable animation speeds
- [ ] Support for dark mode skeleton variants
- [ ] Enhanced mobile-specific optimizations
