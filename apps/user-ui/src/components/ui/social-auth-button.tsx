import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SocialAuthButtonProps {
  provider: 'google' | 'facebook';
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

/**
 * SocialAuthButton component for social authentication
 * Matches the brand design system with professional styling
 */
export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  provider,
  onClick,
  isLoading = false,
  disabled = false,
  className = '',
  children,
  icon,
}) => {
  const baseStyles = cn(
    // Base button styling
    'w-full h-12 rounded-full font-medium text-base transition-all duration-300',
    'flex items-center justify-center gap-3',
    'border-2 shadow-lg hover:shadow-xl',
    'backdrop-blur-sm',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    
    // Provider-specific styling
    provider === 'google' && [
      'bg-white/95 hover:bg-white text-gray-700 hover:text-gray-900',
      'border-gray-200 hover:border-gray-300',
      'focus:ring-gray-500',
    ],
    provider === 'facebook' && [
      'bg-[#1877F2]/95 hover:bg-[#1877F2] text-white',
      'border-[#1877F2]/20 hover:border-[#1877F2]/40',
      'focus:ring-[#1877F2]',
    ],
    
    // Disabled state
    disabled && 'opacity-50 cursor-not-allowed',
    
    // Loading state
    isLoading && 'cursor-wait',
    
    className
  );

  const handleClick = () => {
    if (!disabled && !isLoading) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={baseStyles}
      aria-label={`Sign in with ${provider === 'google' ? 'Google' : 'Facebook'}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};
