'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from '../../lib/toast';
import { useLogoutMutation } from '../../store/authApi';
import { User } from '../../types/auth';
import UserAvatar from './UserAvatar';

interface UserDropdownProps {
  user: User;
  className?: string;
  isLoading?: boolean;

  
}

/**
 * UserDropdown component that provides a professional user menu
 * Similar to Clerk's UserButton with dropdown functionality
 */
export const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  className = '',
  isLoading = false,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      setIsOpen(false);

      // Trigger logout mutation with comprehensive error handling
      const logoutResult = logout();

      // Check if mutation was triggered successfully
      if (!logoutResult || typeof logoutResult.unwrap !== 'function') {
        throw new Error('Logout request failed to initialize');
      }

      await logoutResult.unwrap();

      toast.success('Logged out successfully');

      // Use immediate navigation without delay for better UX
      router.replace('/');
    } catch (error) {
      // Handle logout errors gracefully
      const errorMessage =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as Error)?.message ||
        'Logout failed. Please try again.';

      toast.error('Logout Failed', {
        description: errorMessage,
      });

      // Even if logout fails on server, redirect to home for security
      // The user should not remain on authenticated pages
      router.replace('/');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* User Avatar Button */}
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
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
        "
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User menu"
      >
        <UserAvatar
          user={user}
          size="md"
          isLoading={isLoading || isLogoutLoading}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="
            absolute
            right-0
            top-full
            mt-2
            w-64
            bg-white
            border
            border-gray-200
            rounded-lg
            shadow-lg
            z-50
            animate-in
            fade-in-0
            zoom-in-95
            duration-200
          "
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <UserAvatar
                user={user}
                size="sm"
                isLoading={isLoading || isLogoutLoading}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Profile/Dashboard Link */}
            <button
              className="
                w-full
                text-left
                px-4
                py-2
                text-sm
                text-gray-700
                hover:bg-gray-50
                hover:text-gray-900
                transition-colors
                duration-150
                flex
                items-center
                gap-2
              "
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                // Navigate to profile/dashboard
                window.location.href = '/dashboard';
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Dashboard
            </button>

            {/* Settings Link */}
            <button
              className="
                w-full
                text-left
                px-4
                py-2
                text-sm
                text-gray-700
                hover:bg-gray-50
                hover:text-gray-900
                transition-colors
                duration-150
                flex
                items-center
                gap-2
              "
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                // Navigate to settings
                window.location.href = '/settings';
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1" />

            {/* Logout Button */}
            <button
              className="
                w-full
                text-left
                px-4
                py-2
                text-sm
                text-red-600
                hover:bg-red-50
                hover:text-red-700
                transition-colors
                duration-150
                flex
                items-center
                gap-2
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
              role="menuitem"
              onClick={handleLogout}
              disabled={isLogoutLoading}
            >
              {isLogoutLoading ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              )}
              {isLogoutLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
