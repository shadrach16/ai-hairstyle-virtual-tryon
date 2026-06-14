import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Coins, ExternalLink, Loader2 } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/lib/api';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.hairstudio.app';
const DISMISS_COUNT_KEY = 'hairstudio_rate_dismiss_count';
const PERMANENTLY_DISMISSED_KEY = 'hairstudio_rate_permanently_dismissed';
const MAX_DISMISSALS = 3;

interface RateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function shouldShowRatePrompt(user: { hasClaimedReviewReward?: boolean; isGuest?: boolean } | null): boolean {
  if (!user) return false;
  if (user.isGuest) return false;
  if (user.hasClaimedReviewReward) return false;
  if (Capacitor.getPlatform() === 'web') return false;

  const permanentlyDismissed = localStorage.getItem(PERMANENTLY_DISMISSED_KEY);
  if (permanentlyDismissed === 'true') return false;

  const dismissCount = parseInt(localStorage.getItem(DISMISS_COUNT_KEY) || '0', 10);
  if (dismissCount >= MAX_DISMISSALS) return false;

  return true;
}

export default function RateAppModal({ isOpen, onClose }: RateAppModalProps) {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<'prompt' | 'claim'>('prompt');
  const [isClaiming, setIsClaiming] = useState(false);

  const handleDismiss = useCallback(() => {
    const current = parseInt(localStorage.getItem(DISMISS_COUNT_KEY) || '0', 10);
    const newCount = current + 1;
    localStorage.setItem(DISMISS_COUNT_KEY, String(newCount));
    if (newCount >= MAX_DISMISSALS) {
      localStorage.setItem(PERMANENTLY_DISMISSED_KEY, 'true');
    }
    onClose();
  }, [onClose]);

  const handleRateNow = useCallback(async () => {
    try {
      window.open(PLAY_STORE_URL, '_blank');
      // Move to claim step after opening store
      setStep('claim');
    } catch {
      toast.error('Could not open Play Store.');
    }
  }, []);

  const handleClaimReward = useCallback(async () => {
    setIsClaiming(true);
    try {
      const result = await apiService.claimReviewReward();
      if (result.success) {
        toast.success(result.message || '3 credits added!');
        await refreshUser();
        localStorage.setItem(PERMANENTLY_DISMISSED_KEY, 'true');
        onClose();
      } else {
        toast.error(result.message || 'Could not claim reward.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  }, [refreshUser, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-[61] rounded-t-3xl bg-white px-6 pt-3 pb-8 shadow-2xl"
          >
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {step === 'prompt' ? (
              <div className="flex flex-col items-center text-center">
                {/* Star icon cluster */}
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100">
                    <Star className="h-8 w-8 text-amber-500 fill-amber-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 shadow-lg">
                    <Coins className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-1.5">
                  Enjoying HairStudio?
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-gray-500 mb-1 max-w-[280px]">
                  Rate us on the Play Store and earn
                </p>
                <div className="flex items-center gap-1.5 mb-5">
                  <span className="text-2xl font-extrabold text-emerald-600">3</span>
                  <span className="text-sm font-semibold text-emerald-600">free credits</span>
                  <span className="text-xs text-gray-400">(1 free try-on!)</span>
                </div>

                {/* CTA */}
                <button
                  onClick={handleRateNow}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 text-white font-semibold text-[15px] shadow-lg active:scale-[0.97] transition-transform"
                >
                  <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                  Rate & Earn 3 Credits
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </button>

                {/* Dismiss */}
                <button
                  onClick={handleDismiss}
                  className="mt-3 text-[13px] text-gray-400 font-medium active:text-gray-600 transition-colors"
                >
                  Maybe later
                </button>

                {/* Trust line */}
                <p className="mt-4 text-[11px] text-gray-300">
                  One-time offer • Takes 30 seconds
                </p>
              </div>
            ) : (
              /* Claim step - shown after user returns from Play Store */
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 mb-4">
                  <Coins className="h-8 w-8 text-emerald-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1.5">
                  Thank you!
                </h3>
                <p className="text-sm text-gray-500 mb-5 max-w-[260px]">
                  Tap below to claim your 3 free credits.
                </p>

                <button
                  onClick={handleClaimReward}
                  disabled={isClaiming}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 text-white font-semibold text-[15px] shadow-lg active:scale-[0.97] transition-transform disabled:opacity-60"
                >
                  {isClaiming ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Coins className="h-4.5 w-4.5" />
                      Claim 3 Credits
                    </>
                  )}
                </button>

                <button
                  onClick={handleDismiss}
                  className="mt-3 text-[13px] text-gray-400 font-medium active:text-gray-600 transition-colors"
                >
                  I'll do it later
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
