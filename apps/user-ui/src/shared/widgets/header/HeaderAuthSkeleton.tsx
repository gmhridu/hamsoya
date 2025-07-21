'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';

interface HeaderAuthSkeletonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Professional skeleton component for Header authentication area during rehydration
 * Matches UserAvatar component design exactly for seamless loading experience
 * Features:
 * - Same dimensions and positioning as UserAvatar (h-10 w-10 for md size)
 * - Brand-consistent styling with rounded corners, shadows, and backdrop blur
 * - Proper loading spinner overlay matching UserAvatar loading state
 * - Responsive behavior matching auth buttons (hidden on small screens for second element)
 * - Glass-morphism effects consistent with brand design language
 */
export const HeaderAuthSkeleton: React.FC<HeaderAuthSkeletonProps> = ({
  className = '',
  size = 'md',
}) => {
  // Size configurations that match UserAvatar exactly
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  // Loading spinner size configurations that match UserAvatar
  const spinnerSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={`relative ${className}`}>
      {/* User Avatar Button Skeleton - Matches UserDropdown structure exactly */}
      <button
        className="
          flex
          items-center
          justify-center
          rounded-full
          border-2
          border-transparent
          hover:border-brand-primary/20
          focus:border-brand-primary
          focus:outline-none
          transition-all
          duration-200
          p-0.5
          cursor-pointer
        "
        aria-label="Loading user menu"
        disabled
      >
        {/* User Avatar Skeleton - Matches UserAvatar exactly */}
        <div className="relative">
          <Avatar
            className={`
              ${sizeClasses[size]}
              border-2
              border-white
              shadow-sm
              hover:shadow-md
              transition-all
              duration-200
              cursor-pointer
              ring-2
              ring-transparent
              hover:ring-brand-primary/20
            `}
          >
            {/* Fallback with brand gradient matching UserAvatar */}
            <AvatarFallback
              className="
              bg-gradient-to-br
              from-brand-primary
              to-brand-secondary
              text-white
              font-semibold
              border-0
            "
            >
              {/* Placeholder content */}
              <div className="animate-pulse">U</div>
            </AvatarFallback>
          </Avatar>

          {/* Loading spinner overlay that matches UserAvatar loading state */}
          <div
            className="
            absolute
            inset-0
            rounded-full
            bg-black/20
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-10
          "
            aria-label="Loading"
          >
            <div
              className={`
              ${spinnerSizeClasses[size]}
              border-2
              border-gray-300
              border-t-brand-primary
              rounded-full
              animate-spin
            `}
            />
          </div>
        </div>
      </button>
    </div>
  );
};

export default HeaderAuthSkeleton;
