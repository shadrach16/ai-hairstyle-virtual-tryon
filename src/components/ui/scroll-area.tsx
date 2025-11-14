import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';

// --- ScrollBar Component (Updated for better visibility) ---
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      // Use a distinct background color (e.g., bg-slate-100) for better visual context
      // The old styling was relying on border-l/t, which can be hard to see.
      'flex touch-none select-none transition-colors bg-slate-100', 
      orientation === 'vertical' && 'h-full w-2.5 p-[1px]',
      orientation === 'horizontal' && 'w-full h-2.5 flex-col p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb 
        // Changed bg-border to a definite color (e.g., bg-slate-500)
        // for professional styling and visibility. Increased opacity on hover.
        className="relative flex-1 rounded-full bg-slate-500/80 hover:bg-slate-600/90" 
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;


// --- ScrollArea Component ---
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  /* IMPORTANT FIX TIP: 
    For scrolling to work, you MUST ensure that the ScrollArea 
    or its immediate parent has a defined height (e.g., h-full, max-h-[400px], h-[200px]).
    If the ScrollArea expands infinitely, the content will never overflow 
    the Viewport, and the scrollbar won't appear.
  */
  <ScrollAreaPrimitive.Root 
    ref={ref} 
    className={cn('relative overflow-hidden', className)} 
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export { ScrollArea, ScrollBar };