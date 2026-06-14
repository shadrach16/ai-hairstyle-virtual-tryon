// src/components/ui/full-screen-loader.tsx
// Modern full-screen loading overlay with progress and messaging

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface FullScreenLoaderProps {
  /** Whether the loader is visible */
  isLoading: boolean;
  /** Progress percentage (0-100). Shows indeterminate if not provided */
  progress?: number;
  /** Main message to display */
  message?: string;
  /** Secondary message (smaller, below main) */
  subMessage?: string;
  /** Brand icon/logo to show above loader */
  icon?: React.ReactNode;
  /** Background style */
  variant?: 'solid' | 'blur' | 'transparent';
  /** Custom z-index (default: 50) */
  zIndex?: number;
}

export function FullScreenLoader({
  isLoading,
  progress,
  message = 'Loading...',
  subMessage,
  icon,
  variant = 'blur',
  zIndex = 50,
}: FullScreenLoaderProps) {
  // Don't render if not loading
  if (!isLoading) return null;

  const bgClasses = {
    solid: 'bg-white',
    blur: 'bg-white/80 backdrop-blur-lg',
    transparent: 'bg-black/50',
  };

  const textClasses = {
    solid: 'text-gray-900',
    blur: 'text-gray-900',
    transparent: 'text-white',
  };

  return (
    <div
      className={cn(
        'fixed inset-0 flex flex-col items-center justify-center',
        'animate-fade-in',
        bgClasses[variant]
      )}
      style={{ zIndex }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Icon/Logo */}
      {icon && (
        <div className="mb-6">
          {icon}
        </div>
      )}

      {/* Spinner or Progress Ring */}
      <div className="relative mb-4">
        {progress !== undefined ? (
          // Determinate progress ring
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-amber-500 transition-all duration-300 ease-out"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn('text-lg font-semibold', textClasses[variant])}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        ) : (
          // Indeterminate spinner
          <div className="relative">
            <Loader2 className={cn('w-12 h-12 animate-spin text-amber-500')} />
          </div>
        )}
      </div>

      {/* Message */}
      <p className={cn('text-base font-medium text-center px-6', textClasses[variant])}>
        {message}
      </p>

      {/* Sub-message */}
      {subMessage && (
        <p className={cn(
          'text-sm mt-2 text-center px-6 max-w-xs',
          variant === 'transparent' ? 'text-white/70' : 'text-gray-500'
        )}>
          {subMessage}
        </p>
      )}

      {/* Progress bar (alternative to ring for linear progress) */}
      {progress !== undefined && (
        <div className="w-48 h-1.5 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Compact inline loader for smaller areas
interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function InlineLoader({ size = 'md', message, className }: InlineLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-amber-500', sizeClasses[size])} />
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
}

export default FullScreenLoader;
