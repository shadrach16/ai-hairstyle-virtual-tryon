// src/components/ui/bottom-sheet.tsx
// Modern bottom sheet component with gesture support and safe-area handling

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Height as percentage of viewport (default: 85) */
  height?: number;
  /** Show drag handle indicator */
  showHandle?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Custom class for the content area */
  contentClassName?: string;
  /** Disable closing on backdrop click */
  disableBackdropClose?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 85,
  showHandle = true,
  showCloseButton = true,
  contentClassName,
  disableBackdropClose = false,
}: BottomSheetProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);
  const startY = React.useRef(0);
  const currentY = React.useRef(0);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle touch/drag gestures for dismissal
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - startY.current;
    // Only allow dragging down
    if (delta > 0) {
      setDragOffset(delta);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If dragged more than 100px, close the sheet
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={disableBackdropClose ? undefined : onClose}>
      <DialogContent
        ref={contentRef}
        className={cn(
          'fixed inset-x-0 bottom-0 top-auto p-0 rounded-t-3xl border-0 shadow-2xl',
          'data-[state=open]:animate-slide-in-bottom data-[state=closed]:animate-slide-out-bottom',
          'focus:outline-none max-w-full sm:max-w-full',
          isDragging && 'transition-none',
          contentClassName
        )}
        style={{
          height: `${height}vh`,
          maxHeight: `${height}vh`,
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onInteractOutside={(e) => {
          if (disableBackdropClose) {
            e.preventDefault();
          }
        }}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div
            className="w-full py-3 flex justify-center cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <DialogHeader className="px-4 pb-3 flex flex-row items-center justify-between border-b border-gray-100">
            {title && (
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {title}
              </DialogTitle>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </DialogHeader>
        )}

        {/* Scrollable Content */}
        <div 
          className={cn(
            'flex-1 overflow-y-auto overscroll-contain',
            'pb-[var(--safe-area-bottom,0px)]'
          )}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BottomSheet;
