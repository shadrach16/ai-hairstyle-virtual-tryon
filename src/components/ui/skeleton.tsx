import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-md bg-gray-200/80',
        'bg-gradient-to-r from-gray-200/80 via-gray-100/60 to-gray-200/80',
        'bg-[length:200%_100%] animate-skeleton-wave',
        className
      )}
      {...props}
    />
  );
}

/** Circle skeleton for avatars/thumbnails */
function SkeletonCircle({ size = 40, className, ...props }: { size?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn('rounded-full flex-shrink-0', className)}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}

/** Text line skeleton — renders multiple lines with natural widths */
function SkeletonText({
  lines = 1,
  className,
  ...props
}: { lines?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const widths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-2/3'];
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', widths[i % widths.length])}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCircle, SkeletonText };
