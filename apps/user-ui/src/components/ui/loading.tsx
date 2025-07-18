import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-brand-accent border-t-brand-primary',
        sizeClasses[size],
        className
      )}
    />
  );
};

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingDots = ({ size = 'md', className }: LoadingDotsProps) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-brand-primary rounded-full animate-pulse',
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay = ({ 
  isVisible, 
  message = 'Loading...', 
  className 
}: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-white/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4 p-8 rounded-xl bg-white/95 shadow-xl border border-brand-accent/20">
        <LoadingSpinner size="lg" />
        <p className="text-brand-primary font-medium text-lg">{message}</p>
      </div>
    </div>
  );
};

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const LoadingButton = ({
  isLoading,
  children,
  className,
  disabled,
  onClick,
  type = 'button',
}: LoadingButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'relative inline-flex items-center justify-center',
        'bg-gradient-to-r from-brand-primary to-brand-secondary',
        'hover:from-brand-primary/90 hover:to-brand-secondary/90',
        'text-white font-semibold rounded-xl',
        'transition-all duration-200 transform hover:scale-[1.02]',
        'disabled:transform-none disabled:hover:scale-100',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'shadow-lg hover:shadow-xl',
        className
      )}
    >
      {isLoading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      <span className={cn(isLoading && 'opacity-75')}>{children}</span>
    </button>
  );
};

interface LoadingCardProps {
  className?: string;
}

export const LoadingCard = ({ className }: LoadingCardProps) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-white rounded-xl border border-brand-accent/20 p-6 space-y-4',
        className
      )}
    >
      <div className="h-4 bg-brand-accent/30 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-brand-accent/20 rounded"></div>
        <div className="h-3 bg-brand-accent/20 rounded w-5/6"></div>
      </div>
      <div className="h-8 bg-brand-primary/20 rounded w-1/3"></div>
    </div>
  );
};

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage = ({ message = 'Loading...' }: LoadingPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-accent/10 to-brand-secondary/10">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-brand-accent rounded-full animate-spin border-t-brand-primary mx-auto"></div>
          <div className="w-16 h-16 border-4 border-brand-secondary/30 rounded-full animate-spin border-t-brand-secondary absolute top-2 left-1/2 transform -translate-x-1/2 animate-reverse-spin"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-primary">Hamsoya</h2>
          <p className="text-brand-secondary font-medium">{message}</p>
          <LoadingDots size="md" className="justify-center" />
        </div>
      </div>
    </div>
  );
};
