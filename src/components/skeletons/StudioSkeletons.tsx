// Skeleton for studio-specific surfaces (ready state, results)
import React from 'react';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

/** Skeleton for the ready-state photo + hairstyle preview area */
export function ReadyStateSkeleton() {
  return (
    <div className="flex flex-col items-center p-6 space-y-4 animate-fade-in">
      {/* Photo area */}
      <Skeleton className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl" />
      {/* Hairstyle info */}
      <div className="w-full max-w-sm space-y-3">
        <Skeleton className="h-4 w-1/3 mx-auto" />
        {/* Cost/ETA/quality grid */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-gray-100">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-2 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the results viewer image area */
export function ResultsSkeleton() {
  return (
    <div className="flex flex-col items-center p-6 space-y-4 animate-fade-in">
      <Skeleton className="w-full max-w-sm aspect-[3/4] rounded-2xl" />
      <div className="flex gap-3 w-full max-w-sm">
        <Skeleton className="flex-1 h-12 rounded-xl" />
        <Skeleton className="flex-1 h-12 rounded-xl" />
      </div>
    </div>
  );
}

/** Skeleton for the paywall / pricing content */
export function PaywallSkeleton() {
  return (
    <div className="p-4 space-y-3">
      {/* Tab bar */}
      <Skeleton className="h-10 w-full rounded-xl" />
      {/* Plan cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-800/50">
          <Skeleton className="w-11 h-11 rounded-xl bg-gray-700" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-1/3 bg-gray-700" />
            <Skeleton className="h-2.5 w-2/3 bg-gray-700" />
          </div>
          <Skeleton className="h-9 w-20 rounded-full bg-gray-700" />
        </div>
      ))}
    </div>
  );
}

export { ReadyStateSkeleton as default };
