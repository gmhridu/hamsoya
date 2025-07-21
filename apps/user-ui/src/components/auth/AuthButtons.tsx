'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface AuthButtonsProps {
  className?: string;
}

/**
 * AuthButtons component that displays Sign In and Sign Up buttons
 * for non-authenticated users
 */
export const AuthButtons: React.FC<AuthButtonsProps> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
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
};

export default AuthButtons;
