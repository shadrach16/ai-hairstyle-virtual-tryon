// Skeleton for the mobile profile hub page
import React from 'react';
import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/ui/skeleton';

export function ProfileHubSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Avatar + name area */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-card shadow-card">
        <SkeletonCircle size={56} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-3 bg-white rounded-card shadow-card">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-2.5 w-12" />
          </div>
        ))}
      </div>

      {/* Action cards */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-card shadow-card">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-2.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfileHubSkeleton;
