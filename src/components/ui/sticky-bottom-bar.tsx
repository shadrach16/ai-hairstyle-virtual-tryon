// src/components/ui/sticky-bottom-bar.tsx
// Reusable sticky bottom bar with safe-area support for mobile

import * as React from 'react';
import { cn } from '@/lib/utils';

interface StickyBottomBarProps {
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
  /** Show on all screens or just mobile (default: mobile only via lg:hidden) */
  mobileOnly?: boolean;
  /** Add blur backdrop effect */
  withBackdrop?: boolean;
  /** Custom z-index (default: 40) */
  zIndex?: number;
  /** Hide the bar (useful for processing states) */
  hidden?: boolean;
}

export function StickyBottomBar({
  children,
  className,
  mobileOnly = true,
  withBackdrop = false,
  zIndex = 40,
  hidden = false,
}: StickyBottomBarProps) {
  if (hidden) return null;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 border-t shadow-lg',
        'transition-transform duration-300 ease-out',
        withBackdrop 
          ? 'bg-white/80 backdrop-blur-lg border-gray-200/60' 
          : 'bg-white border-gray-200',
        mobileOnly && 'lg:hidden',
        className
      )}
      style={{ zIndex }}
    >
      {/* Content with safe-area padding */}
      <div className="px-4 py-3 pb-[max(12px,calc(12px+var(--safe-area-bottom,0px)))]">
        {children}
      </div>
    </div>
  );
}

// Convenience wrapper for action buttons layout
interface BottomBarActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomBarActions({ children, className }: BottomBarActionsProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {children}
    </div>
  );
}

// Selected item preview for bottom bar
interface BottomBarPreviewProps {
  image?: string;
  title: string;
  subtitle?: string;
  onClear?: () => void;
}

export function BottomBarPreview({ image, title, subtitle, onClear }: BottomBarPreviewProps) {
  return (
    <div className="flex items-center gap-3 mb-2">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-10 h-10 object-cover rounded-lg border border-gray-200"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
      {onClear && (
        <button
          onClick={onClear}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Clear selection"
        >
          <span className="text-gray-600 text-lg leading-none">×</span>
        </button>
      )}
    </div>
  );
}

export default StickyBottomBar;
