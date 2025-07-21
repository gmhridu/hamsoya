'use client';

import UserDropdown from 'apps/user-ui/src/components/auth/UserDropdown';
import { useAppSelector } from 'apps/user-ui/src/store';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container } from '../../../components/layout';
import { Button } from '../../../components/ui/button';
import HeaderAuthSkeleton from './HeaderAuthSkeleton';
import SearchBar from './SearchBar';

const Header = () => {
  const { user, isAuthenticated, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  // Get Redux Persist rehydration status to prevent auth state flash
  const isRehydrated = useAppSelector(
    (state) => (state as any)._persist?.rehydrated ?? false
  );

  // Enhanced loading state management to ensure skeleton shows during rehydration
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Track initial rehydration and authentication state changes
  useEffect(() => {
    // If we're rehydrated and have determined the auth state, hide skeleton
    if (isRehydrated && isInitialized) {
      // Add a small delay to ensure smooth transition and prevent flash
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 100);
      return () => clearTimeout(timer);
    }
    // Return undefined for other cases (no cleanup needed)
    return undefined;
  }, [isRehydrated, isInitialized]);

  // Reset loading state on mount to handle page reloads
  useEffect(() => {
    // On initial mount, ensure we show skeleton until rehydration is complete
    if (!isRehydrated || !isInitialized) {
      setShowSkeleton(true);
    }
  }, [isRehydrated, isInitialized]);
  return (
    <header className="border-b border-brand-muted/20 bg-white shadow-sm font-sora">
      <Container className="py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src={'/logo.png'}
              alt="Hamsoya"
              width={59}
              height={29}
              className="object-contain h-[36px]"
              priority={true}
            />
            <h1 className="text-[24px] font-bold text-brand-primary hidden sm:block">
              Hamsoya
            </h1>
          </Link>

          {/* Search Section */}
          <SearchBar className="flex-1 max-w-2xl mx-2 md:mx-4" />

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Wishlist */}
            <Button
              size={'icon'}
              variant={'ghost'}
              className="rounded-full p-2 border border-[#1B1B1B1A]"
            >
              <Image
                src="/wishlist.svg"
                alt="Wishlist"
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
                priority={true}
              />
            </Button>

            {/* Cart */}
            <Button
              className="rounded-full p-2 border border-[#1B1B1B1A]"
              size={'icon'}
              variant={'ghost'}
            >
              <Image
                src="/cart.svg"
                alt="Cart"
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </Button>

            {/* Authentication State - Enhanced with proper skeleton loading */}
            {(() => {
              // PRIORITY 1: Show skeleton during initial load and rehydration
              if (showSkeleton || !isRehydrated || !isInitialized) {
                return <HeaderAuthSkeleton />;
              }

              // PRIORITY 2: If authenticated with user data, show UserDropdown
              if (isAuthenticated && user) {
                return <UserDropdown user={user} isLoading={isLoading} />;
              }

              // PRIORITY 3: If explicitly not authenticated, show auth buttons
              if (!isAuthenticated) {
                return (
                  <div className="flex items-center gap-2">
                    {/* Sign In Button */}
                    <Button
                      asChild
                      variant="ghost"
                      className="
                          rounded-full
                          border
                          border-[#1B1B1B1A]
                          hover:bg-gray-50
                          hover:border-brand-primary/20
                          transition-all
                          duration-200
                          px-4
                          py-2
                          text-sm
                          font-medium
                        "
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>

                    {/* Sign Up Button */}
                    <Button
                      asChild
                      className="
                          rounded-full
                          bg-brand-primary
                          hover:bg-brand-primary/90
                          text-white
                          px-4
                          py-2
                          hidden
                          sm:inline-flex
                          transition-all
                          duration-200
                          text-sm
                          font-medium
                          shadow-sm
                          hover:shadow-md
                        "
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                );
              }

              // FALLBACK: Should rarely be reached, but provides safe default
              return (
                <div className="flex items-center gap-2">
                  {/* Sign In Button */}
                  <Button
                    asChild
                    variant="ghost"
                    className="
                        rounded-full
                        border
                        border-[#1B1B1B1A]
                        hover:bg-gray-50
                        hover:border-brand-primary/20
                        transition-all
                        duration-200
                        px-4
                        py-2
                        text-sm
                        font-medium
                      "
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>

                  {/* Sign Up Button */}
                  <Button
                    asChild
                    className="
                        rounded-full
                        bg-brand-primary
                        hover:bg-brand-primary/90
                        text-white
                        px-4
                        py-2
                        hidden
                        sm:inline-flex
                        transition-all
                        duration-200
                        text-sm
                        font-medium
                        shadow-sm
                        hover:shadow-md
                      "
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              );
            })()}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
