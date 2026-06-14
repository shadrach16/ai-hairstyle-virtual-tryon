// src/components/studio/StudioStepper.tsx
// Minimal pill-style progress indicator

import React from 'react';
import { cn } from '@/lib/utils';
import { StudioState } from '@/hooks/useStudioPageLogic';

const steps = [
  { id: 'upload', label: 'Photo' },
  { id: 'ready', label: 'Style' },
  { id: 'processing', label: 'Creating' },
  { id: 'results', label: 'Result' },
] as const;

interface StudioStepperProps {
  activeState: StudioState;
  className?: string;
}

export const StudioStepper: React.FC<StudioStepperProps> = ({ activeState, className }) => {
  const activeIndex = steps.findIndex(step => step.id === activeState);
  if (activeIndex === -1) return null;

  return (
    <div
      className={cn('w-full max-w-md mx-auto', className)}
      role="list"
      aria-label="Generation progress"
    >
      {/* Segmented progress bar */}
      <div className="flex items-center gap-1.5">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex flex-col items-center gap-1.5">
            {/* Bar segment */}
            <div
              className={cn(
                'h-[3px] w-full rounded-full transition-colors duration-300',
                index < activeIndex && 'bg-[#1a1a1a]',
                index === activeIndex && 'bg-[#1a1a1a]',
                index > activeIndex && 'bg-gray-100',
              )}
            />
            {/* Label */}
            <span
              className={cn(
                'text-[10px] font-medium transition-colors duration-300',
                index <= activeIndex ? 'text-gray-600' : 'text-gray-300',
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};