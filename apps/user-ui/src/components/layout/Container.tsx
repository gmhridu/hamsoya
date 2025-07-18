import React from 'react';
import { cn } from '../../lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Global container component that applies consistent 160px horizontal spacing
 * across the entire application on desktop screens.
 *
 * Responsive spacing:
 * - Mobile: 16px (px-4)
 * - Small: 24px (px-6)
 * - Medium: 32px (px-8)
 * - Large+: 160px (px-[160px]) - Matches Figma design
 */
export const Container = ({
  children,
  className,
  as: Component = 'div',
}: ContainerProps) => {
  return (
    <Component
      className={cn(
        // Global horizontal spacing - 160px on desktop
        'px-4 sm:px-6 md:px-8 lg:px-[160px] xl:px-[160px] 2xl:px-[160px]',
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Container;
