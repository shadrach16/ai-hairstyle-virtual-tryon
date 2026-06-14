import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProcessingStateProps {
  selectedPhoto: File;
  selectedHairstyle: { name: string; id: string } | null;
  progress: number;
  onComplete?: () => void;
}

const steps = [
  { label: 'Analyzing photo', threshold: 30 },
  { label: 'Applying style', threshold: 65 },
  { label: 'Refining details', threshold: 90 },
  { label: 'Finishing up', threshold: 100 },
];

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  selectedPhoto,
  selectedHairstyle,
  progress,
  onComplete,
}) => {
  const visualProgress = Math.min(Math.max(progress, 0), 99);
  const displayProgress = Math.round(visualProgress);
  const [countdown, setCountdown] = useState(12);
  const [processingComplete, setProcessingComplete] = useState(false);

  const photoUrl = useMemo(() => URL.createObjectURL(selectedPhoto), [selectedPhoto]);

  useEffect(() => {
    return () => URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  useEffect(() => {
    if (progress >= 99 && !processingComplete) {
      setProcessingComplete(true);
    }
  }, [progress, processingComplete]);

  useEffect(() => {
    if (processingComplete && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (processingComplete && countdown === 0) {
      onComplete?.();
    }
  }, [processingComplete, countdown, onComplete]);

  const activeStepIndex = steps.findIndex(s => visualProgress < s.threshold);
  const currentStep = steps[activeStepIndex >= 0 ? activeStepIndex : steps.length - 1];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-10">
      {/* ── Photo with animated ring ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative mb-8"
      >
        {/* Spinning gradient ring */}
        <div className="absolute -inset-[3px] rounded-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,#1a1a1a,#d4d4d4,#1a1a1a)]" />
        <div className="absolute -inset-[1px] rounded-full bg-white" />
        <img
          src={photoUrl}
          alt="Your photo"
          className="relative w-32 h-32 rounded-full object-cover"
        />
      </motion.div>

      {/* ── Style name ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-center mb-8"
      >
        <p className="text-[13px] text-gray-400 mb-1">Applying</p>
        <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
          {selectedHairstyle?.name || 'Hairstyle'}
        </h2>
      </motion.div>

      {/* ── Progress section ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="w-full max-w-xs space-y-4"
      >
        {/* Thin progress bar */}
        <div>
          <div className="w-full h-[5px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#1a1a1a] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${visualProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[12px] font-medium text-gray-400">
              {currentStep.label}
            </span>
            <span className="text-[12px] font-semibold text-gray-900 tabular-nums">
              {displayProgress}%
            </span>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {steps.map((step, i) => {
            const done = activeStepIndex > i || (activeStepIndex === -1);
            const active = activeStepIndex === i;
            return (
              <div key={step.label} className="flex items-center gap-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    done
                      ? 'w-6 bg-[#1a1a1a]'
                      : active
                      ? 'w-6 bg-[#1a1a1a]/40'
                      : 'w-1.5 bg-gray-200'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* ETA */}
        <p className="text-center text-[11px] text-gray-300 pt-2">
          {progress < 30
            ? 'About 20–30 seconds'
            : progress < 60
            ? 'About 10–15 seconds'
            : progress < 90
            ? 'A few seconds left'
            : 'Almost there'}
        </p>
      </motion.div>

      {/* ── Refund assurance ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex items-center gap-1.5 mt-10"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
        <span className="text-[11px] text-gray-300">
          Auto-refunded if generation fails
        </span>
      </motion.div>
    </div>
  );
};