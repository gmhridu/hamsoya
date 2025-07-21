'use client';

import React from 'react';
import { User } from '../../types/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showOnlineStatus?: boolean;
  isLoading?: boolean;

  isRehydrated?: boolean;
}

/**
 * Professional user avatar component using shadcn/ui Avatar
 * Features:
 * - Perfect round shape with shadcn/ui Avatar component
 * - Fallback to user initials with brand gradient
 * - Multiple sizes (sm, md, lg)
 * - Professional styling with hover effects
 * - Accessibility support
 * - Optional online status indicator
 * - Loading spinner overlay for refresh states
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  className = '',
  showOnlineStatus = false,
  isLoading = false,
  isRehydrated = false,
}) => {
  // Generate user initials from name
  const getInitials = (name: string): string => {
    if (!name) return 'U';

    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Size configurations
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  // Loading spinner size configurations
  const spinnerSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const initials = getInitials(user.name || user.email || 'U');

  return (
    <div className={`relative ${className}`}>
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
        {/* Profile image if available */}
        {user.avatar && (
          <AvatarImage
            src={user.avatar}
            alt={`${user.name || user.email}'s avatar`}
            className="object-cover"
          />
        )}

        {/* Fallback to initials with brand gradient */}
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
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Loading spinner overlay */}
      {isLoading && (
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
      )}

      {/* Online status indicator */}
      {showOnlineStatus && (
        <div
          className="
            absolute
            -bottom-0.5
            -right-0.5
            h-3
            w-3
            rounded-full
            bg-green-500
            border-2
            border-white
            shadow-sm
            z-20
          "
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default UserAvatar;
