// G3: Streak Hub — daily check-in, milestone progress, streak flame
import React, { useState, useCallback, useEffect } from 'react';
import { Flame, Gift, Check, ChevronRight, Trophy, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService } from '@/lib/api';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Milestone {
  days: number;
  credits: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStreakDate: string | null;
  alreadyCheckedInToday: boolean;
  nextMilestone: Milestone | null;
  milestones: Record<string, number>;
}

interface StreakHubProps {
  onCreditChange?: () => void;
  className?: string;
}

const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style });
    }
  } catch (e) {}
};

// ─── Milestone pip row ──────────────────────────────────────────────────

const MilestonePips: React.FC<{ current: number; milestones: Record<string, number> }> = ({
  current,
  milestones,
}) => {
  const sorted = Object.entries(milestones)
    .map(([d, c]) => ({ days: Number(d), credits: c }))
    .sort((a, b) => a.days - b.days);

  return (
    <div className="flex items-center justify-between gap-1 w-full px-1" role="list" aria-label="Streak milestones">
      {sorted.map((m) => {
        const reached = current >= m.days;
        return (
          <div key={m.days} role="listitem" aria-label={`Day ${m.days} milestone: ${reached ? 'reached' : 'not yet reached'}, +${m.credits} credits`} className="flex flex-col items-center gap-0.5 flex-1">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors',
                reached
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              )}
              aria-hidden="true"
            >
              {reached ? <Check className="w-3.5 h-3.5" /> : m.days}
            </div>
            <span className="text-[9px] text-gray-500" aria-hidden="true">
              +{m.credits}cr
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Progress bar towards next milestone ────────────────────────────────

const StreakProgress: React.FC<{
  current: number;
  nextMilestone: Milestone | null;
  milestones: Record<string, number>;
}> = ({ current, nextMilestone, milestones }) => {
  if (!nextMilestone) {
    return (
      <div className="text-center py-1">
        <span className="text-xs text-amber-600 font-medium">
          All milestones reached!
        </span>
      </div>
    );
  }

  // Find the previous milestone day
  const milestoneKeys = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  const prevIdx = milestoneKeys.indexOf(nextMilestone.days) - 1;
  const prevDay = prevIdx >= 0 ? milestoneKeys[prevIdx] : 0;

  const range = nextMilestone.days - prevDay;
  const progress = Math.min(1, Math.max(0, (current - prevDay) / range));

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Day {current}</span>
        <span className="text-amber-600 font-medium">
          Day {nextMilestone.days}: +{nextMilestone.credits} credits
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Streak progress to next milestone">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[11px] text-gray-500 text-center">
        {nextMilestone.days - current} day{nextMilestone.days - current !== 1 ? 's' : ''} to next reward
      </p>
    </div>
  );
};

// ─── Main StreakHub ─────────────────────────────────────────────────────

export default function StreakHub({ onCreditChange, className }: StreakHubProps) {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const fetchStreak = useCallback(async () => {
    try {
      const result = await apiService.getStreakStatus();
      if (result.success && result.data) {
        setStreak(result.data);
      }
    } catch (e) {
      console.error('Failed to load streak:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const handleCheckIn = useCallback(async () => {
    if (checkingIn || streak?.alreadyCheckedInToday) return;
    setCheckingIn(true);
    triggerHaptic(ImpactStyle.Medium);

    try {
      const result = await apiService.checkInStreak();
      if (result.success && result.data) {
        const data = result.data;

        // Update local state
        setStreak((prev) =>
          prev
            ? {
                ...prev,
                currentStreak: data.currentStreak,
                longestStreak: data.longestStreak,
                alreadyCheckedInToday: true,
                nextMilestone: data.nextMilestone,
              }
            : prev
        );

        // Milestone celebration
        if (data.milestonesHit?.length > 0) {
          setShowCelebration(true);
          triggerHaptic(ImpactStyle.Heavy);
          toast.success(
            `🎉 Streak milestone! +${data.creditsAwarded} credit${data.creditsAwarded !== 1 ? 's' : ''}`,
            { duration: 4000 }
          );
          setTimeout(() => setShowCelebration(false), 3000);
          onCreditChange?.();
        } else {
          toast.success(result.message || `Day ${data.currentStreak}! 🔥`);
        }

        // Track event
        apiService.trackEvent('streak_checkin_tap', {
          streak: data.currentStreak,
          milestone: data.milestonesHit?.length > 0,
        });
      } else {
        toast.error(result.message || 'Check-in failed');
      }
    } catch {
      toast.error('Could not check in');
    } finally {
      setCheckingIn(false);
    }
  }, [checkingIn, streak?.alreadyCheckedInToday, onCreditChange]);

  if (loading) {
    return (
      <div className={cn('rounded-2xl bg-white border border-gray-100 p-5 animate-pulse', className)}>
        <div className="h-20" />
      </div>
    );
  }

  if (!streak) return null;

  const { currentStreak, longestStreak, alreadyCheckedInToday, nextMilestone, milestones } = streak;

  return (
    <div className={cn('rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm', className)}>
      {/* Header stripe */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Flame className="w-6 h-6 text-white" />
            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -inset-2"
                >
                  <Gift className="w-10 h-10 text-yellow-200" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <h3 className="text-white font-bold text-base leading-tight">Daily Streak</h3>
            <p className="text-white/70 text-xs">
              Best: {longestStreak} day{longestStreak !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Big streak counter */}
        <div className="flex items-baseline gap-1 bg-white/20 rounded-xl px-3 py-1.5">
          <span className="text-2xl font-extrabold text-white">{currentStreak}</span>
          <span className="text-xs text-white/80 font-medium">
            day{currentStreak !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Milestone pips */}
        {milestones && <MilestonePips current={currentStreak} milestones={milestones} />}

        {/* Progress bar */}
        <StreakProgress current={currentStreak} nextMilestone={nextMilestone} milestones={milestones || {}} />

        {/* Check-in button */}
        <button
          onClick={handleCheckIn}
          disabled={alreadyCheckedInToday || checkingIn}
          className={cn(
            'w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97]',
            alreadyCheckedInToday
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
          )}
        >
          {checkingIn ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span className="sr-only">Checking in...</span></>
          ) : alreadyCheckedInToday ? (
            <>
              <Check className="w-4 h-4" />
              Checked in today
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              Check in for Day {currentStreak + 1}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
