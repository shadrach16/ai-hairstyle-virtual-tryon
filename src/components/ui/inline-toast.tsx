// src/components/ui/inline-toast.tsx
// In-context toast/notification component for mobile-friendly feedback

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface InlineToastProps {
  /** Type of toast */
  variant: ToastVariant;
  /** Main message */
  message: string;
  /** Optional description */
  description?: string;
  /** Show dismiss button */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Auto-dismiss after ms (0 = no auto-dismiss) */
  autoDismiss?: number;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Additional classes */
  className?: string;
  /** Compact mode for inline usage */
  compact?: boolean;
}

const variantConfig: Record<ToastVariant, { icon: React.ElementType; bgClass: string; iconClass: string; borderClass: string }> = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-green-50',
    iconClass: 'text-green-500',
    borderClass: 'border-green-200',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-red-50',
    iconClass: 'text-red-500',
    borderClass: 'border-red-200',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-50',
    iconClass: 'text-amber-500',
    borderClass: 'border-amber-200',
  },
  info: {
    icon: Info,
    bgClass: 'bg-blue-50',
    iconClass: 'text-blue-500',
    borderClass: 'border-blue-200',
  },
};

export function InlineToast({
  variant,
  message,
  description,
  dismissible = false,
  onDismiss,
  autoDismiss = 0,
  action,
  className,
  compact = false,
}: InlineToastProps) {
  const [visible, setVisible] = React.useState(true);
  const config = variantConfig[variant];
  const Icon = config.icon;

  // Auto-dismiss timer
  React.useEffect(() => {
    if (autoDismiss > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-300',
        'animate-slide-in-bottom',
        config.bgClass,
        config.borderClass,
        compact ? 'px-3 py-2' : 'px-4 py-3',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon className={cn('flex-shrink-0 mt-0.5', config.iconClass, compact ? 'w-4 h-4' : 'w-5 h-5')} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-gray-900', compact ? 'text-sm' : 'text-base')}>
            {message}
          </p>
          {description && !compact && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'font-medium underline hover:no-underline transition-all',
                config.iconClass,
                compact ? 'text-sm mt-1' : 'text-sm mt-2'
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}

// Floating toast for global notifications (positioned at bottom)
interface FloatingToastProps extends InlineToastProps {
  /** Position of the toast */
  position?: 'top' | 'bottom';
}

export function FloatingToast({ position = 'bottom', ...props }: FloatingToastProps) {
  return (
    <div
      className={cn(
        'fixed left-4 right-4 z-50',
        position === 'bottom' ? 'bottom-[calc(var(--bottom-total,80px)+16px)]' : 'top-[calc(var(--header-total,60px)+16px)]'
      )}
    >
      <InlineToast {...props} />
    </div>
  );
}

export default InlineToast;
