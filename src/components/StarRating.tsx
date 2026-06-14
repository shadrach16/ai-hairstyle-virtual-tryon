// G1: Star rating component for generation feedback
import React, { useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabel?: boolean;
  className?: string;
}

const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Amazing'];

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
};

const gapMap = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

const triggerHaptic = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch (e) {}
};

export function StarRating({
  value,
  onChange,
  size = 'md',
  readonly = false,
  showLabel = true,
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  const handleClick = useCallback((star: number) => {
    if (readonly || !onChange) return;
    triggerHaptic();
    onChange(star);
  }, [readonly, onChange]);

  return (
    <div className={cn('flex items-center', gapMap[size], className)}>
      <div
        className={cn('flex', gapMap[size])}
        role="radiogroup"
        aria-label="Rating"
        onMouseLeave={() => !readonly && setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            disabled={readonly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            className={cn(
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 rounded-sm',
              !readonly && 'cursor-pointer active:scale-110',
              readonly && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                star <= displayValue
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        ))}
      </div>
      {showLabel && displayValue > 0 && (
        <span className="text-sm text-gray-500 font-medium ml-1">
          {labels[displayValue]}
        </span>
      )}
    </div>
  );
}

export default StarRating;
