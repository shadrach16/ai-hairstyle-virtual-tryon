// Skeleton for the hairstyle grid (mobile gallery + desktop sidebar)
import React from 'react';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

interface HairstyleGridSkeletonProps {
  count?: number;
  columns?: 2 | 3;
}

export function HairstyleGridSkeleton({ count = 6, columns = 2 }: HairstyleGridSkeletonProps) {
  return (
    <div className={`grid gap-3 p-4 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-card overflow-hidden bg-white shadow-card">
          <Skeleton className="w-full aspect-square rounded-none" />
          <div className="p-2.5 space-y-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Single row skeleton for inline hairstyle chips */
export function HairstyleChipsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-2 px-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-8 rounded-full flex-shrink-0"
          style={{ width: 72 + Math.random() * 32 }}
        />
      ))}
    </div>
  );
}

export default HairstyleGridSkeleton;
