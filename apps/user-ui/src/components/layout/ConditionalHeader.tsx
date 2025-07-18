'use client';

import { usePathname } from 'next/navigation';
import Header from '../../shared/widgets/header/Header';

/**
 * ConditionalHeader component that conditionally renders the Header
 * based on the current route. Excludes header from authentication pages
 * to provide a clean, focused user experience.
 */
export function ConditionalHeader() {
  const pathname = usePathname();
  
  // List of routes where header should be hidden
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  
  // Check if current path is an authentication route
  const isAuthRoute = authRoutes.includes(pathname);
  
  // Don't render header on authentication pages
  if (isAuthRoute) {
    return null;
  }
  
  // Render header for all other pages
  return <Header />;
}
