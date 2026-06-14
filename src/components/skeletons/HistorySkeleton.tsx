// Skeleton for the generation history list
import React from 'react';
import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/ui/skeleton';

interface HistorySkeletonProps {
  count?: number;
}

export function HistorySkeleton({ count = 5 }: HistorySkeletonProps) {
  return (
    <div className="space-y-3 py-4 px-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 bg-white rounded-card "
        >
          <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-2.5 w-1/4" />
            <Skeleton className="h-2.5 w-2/5" />
          </div>
          <SkeletonCircle size={20} />
        </div>
      ))}
    </div>
  );
}

export default HistorySkeleton;
