import React, { useCallback, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { AdService } from '@/lib/adService';
import { apiService, type CreditLedgerResponse, type CreditLedgerTransaction } from '@/lib/api';
import { cn } from '@/lib/utils';
import AuthModal from '@/components/AuthModal';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronRight,
  Coins,
  Copy,
  Flame,
  Gift,
  History,
  Loader2,
  Share2,
  ShoppingCart,
  Tv,
  Users,
  X,
  Zap,
} from 'lucide-react';
import StreakHub from '@/components/StreakHub';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPaywall?: () => void; // C4: Bridge to paywall
}

interface ReferralInfo {
  referralCode: string;
  referralCount: number;
  creditsEarned: number;
}

const transactionTitleMap: Record<string, string> = {
  purchase: 'Credit purchase',
  spend: 'Generation spend',
  refund: 'Refund issued',
  ad_reward: 'Ad reward',
  referral_reward: 'Referral reward',
  streak_reward: 'Streak reward',
  review_reward: 'Play Store review reward',
  support_adjustment: 'Support adjustment',
  signup_bonus: 'Signup bonus',
  guest_credit_transfer: 'Guest credit transfer',
};

function CreditActivityTab({ isAuthenticated, isActive, onAuthClick }: { isAuthenticated: boolean; isActive: boolean; onAuthClick: () => void }) {
  const [ledger, setLedger] = useState<CreditLedgerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isActive) {
      return;
    }

    let active = true;

    const loadLedger = async () => {
      setIsLoading(true);
      try {
        const result = await apiService.getCreditLedger();
        if (!active) {
          return;
        }
        if (result.success && result.data) {
          setLedger(result.data);
        } else {
          toast.error('Could not load your credit activity.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadLedger();

    return () => {
      active = false;
    };
  }, [isAuthenticated, isActive]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center py-10 px-4 text-center">
        <p className="text-sm text-gray-500">Sign in to view your credit activity.</p>
        <button onClick={onAuthClick} className="mt-4 px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-sm font-semibold active:scale-[0.97] transition-transform">Sign In</button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>;
  }

  const transactions = ledger?.transactions || [];
  const summary = ledger?.summary;

  return (
    <div className="space-y-4 px-1 py-2">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Balance', value: Number(summary?.currentBalance || 0).toFixed(1), color: 'text-gray-900' },
          { label: 'Earned (30d)', value: `+${Number(summary?.totalRewarded30d || 0).toFixed(1)}`, color: 'text-emerald-600' },
          { label: 'Refunds (30d)', value: `+${Number(summary?.totalRefunded30d || 0).toFixed(1)}`, color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-gray-50 p-3 text-center">
            <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
            <p className={cn('text-lg font-bold tracking-tight', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      {transactions.length === 0 ? (
        <div className="rounded-xl bg-gray-50 py-8 text-center">
          <p className="text-sm text-gray-400">No credit activity yet.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {transactions.map((tx) => {
            const isCredit = tx.direction === 'credit';
            return (
              <div key={tx._id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white ring-1 ring-black/[0.04]">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', isCredit ? 'bg-emerald-50' : 'bg-red-50')}>
                  {isCredit ? <ArrowUpCircle className="w-4 h-4 text-emerald-500" /> : <ArrowDownCircle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-800 truncate">{transactionTitleMap[tx.kind] || tx.kind}</p>
                  <p className="text-[11px] text-gray-400">{new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className={cn('text-[13px] font-bold tabular-nums', isCredit ? 'text-emerald-600' : 'text-red-500')}>
                  {isCredit ? '+' : '-'}{Number(tx.amount).toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReferralTab({ isAuthenticated, onAuthClick }: { isAuthenticated: boolean; onAuthClick: () => void }) {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const appUrl = import.meta.env.VITE_APP_URL || 'https://app.hairstudio.ai';

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const result = await apiService.getReferralInfo();
        if (!active) {
          return;
        }
        if (result.success) {
          setInfo(result.data);
        } else {
          toast.error('Could not load referral info.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const link = info?.referralCode ? `${appUrl}/?ref=${info.referralCode}` : appUrl;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        toast.success('Referral link copied.');
        return;
      }
    } catch {
      // clipboard permission denied — fall through
    }

    toast.error('Clipboard is not available on this device.');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Try Hair Studio',
        text: `Try Hair Studio with my referral link and get free credits: ${link}`,
        url: link,
      });
    } catch {
      await handleCopy();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center py-10 px-4 text-center">
        <p className="text-sm text-gray-500">Sign in to unlock referrals and earn credits.</p>
        <button onClick={onAuthClick} className="mt-4 px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-sm font-semibold active:scale-[0.97] transition-transform">Sign In</button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>;
  }

  return (
    <div className="space-y-5 px-1 py-3">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 p-4 text-center">
          <Users className="mx-auto mb-1.5 h-5 w-5 text-gray-400" />
          <p className="text-xl font-bold text-gray-900">{info?.referralCount || 0}</p>
          <p className="text-[11px] text-gray-400 font-medium">Friends joined</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 text-center">
          <Coins className="mx-auto mb-1.5 h-5 w-5 text-gray-400" />
          <p className="text-xl font-bold text-gray-900">{info?.creditsEarned || 0}</p>
          <p className="text-[11px] text-gray-400 font-medium">Credits earned</p>
        </div>
      </div>

      {/* Referral code */}
      <div className="rounded-xl bg-gray-50 p-3.5 flex items-center justify-between">
        <span className="text-[15px] font-mono font-semibold text-gray-700 tracking-wide">{info?.referralCode || '...'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/[0.06] text-[12px] font-medium text-gray-600 active:scale-95 transition-transform"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1a1a1a] text-white text-sm font-semibold active:scale-[0.97] transition-transform"
      >
        <Share2 className="w-4 h-4" />
        Share referral link
      </button>
    </div>
  );
}

function AdCreditTab({ isAuthenticated, onAuthClick, onRewardGranted }: { isAuthenticated: boolean; onAuthClick: () => void; onRewardGranted: () => Promise<void> }) {
  const [isAdLoading, setIsAdLoading] = useState(false);
  const isNativeAvailable = AdService.isNative();

  const handleWatchAd = useCallback(async () => {
    if (!isAuthenticated) {
      onAuthClick();
      return;
    }

    if (!isNativeAvailable) {
      toast.error('Rewarded ads are only available in the native mobile app.');
      return;
    }

    setIsAdLoading(true);
    try {
      const result = await AdService.showRewardedAd(false);
      if (result.success && result.completed) {
        await apiService.grantFreeCredit();
        await onRewardGranted();
        toast.success('0.5 credit added.');
      } else {
        toast.info('Ad closed before completion.');
      }
    } finally {
      setIsAdLoading(false);
    }
  }, [isAuthenticated, isNativeAvailable, onAuthClick, onRewardGranted]);

  return (
    <div className="flex flex-col items-center px-2 py-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <Zap className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">Watch & Earn</h3>
      <p className="text-[13px] text-gray-400 mt-1 max-w-[220px]">Watch a short ad to receive 0.5 credit instantly.</p>

      <div className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50">
        <Coins className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-bold text-gray-900">+0.5 credit</span>
      </div>

      <button
        onClick={handleWatchAd}
        disabled={isAdLoading}
        className="mt-5 w-full max-w-[260px] flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1a1a1a] text-white text-sm font-semibold disabled:opacity-40 active:scale-[0.97] transition-transform"
      >
        {isAdLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tv className="h-4 w-4" />}
        Watch ad
      </button>

      {!Capacitor.isNativePlatform() && (
        <p className="text-[11px] text-gray-300 mt-3">Available in the mobile app only.</p>
      )}
    </div>
  );
}

export default function RewardsCenterModal({ isOpen, onClose, onOpenPaywall }: RewardsCenterModalProps) {
  const { isAuthenticated, refreshUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState(Capacitor.isNativePlatform() ? 'earn' : 'streaks');

  const handleRewardGranted = async () => {
    await refreshUser();
  };

  const tabs = [
    ...(Capacitor.isNativePlatform() ? [{ id: 'earn', label: 'Earn', icon: Tv }] : []),
    { id: 'streaks', label: 'Streaks', icon: Flame },
    { id: 'referrals', label: 'Referrals', icon: Gift },
    { id: 'activity', label: 'Activity', icon: History },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="rewards-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={onClose}
            />

            {/* Sheet */}
            <motion.div
              key="rewards-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white rounded-t-3xl max-h-[88vh]"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Rewards</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Earn free credits &amp; track activity</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mx-5 p-1 bg-gray-100/80 rounded-2xl">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200',
                        isActive
                          ? 'bg-white text-gray-900 shadow-sm shadow-gray-200/50'
                          : 'text-gray-400'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 pt-3 pb-safe">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeTab === 'earn' && Capacitor.isNativePlatform() && (
                      <AdCreditTab isAuthenticated={isAuthenticated} onAuthClick={() => setShowAuthModal(true)} onRewardGranted={handleRewardGranted} />
                    )}
                    {activeTab === 'streaks' && (
                      <div className="px-1 py-1">
                        <StreakHub onCreditChange={() => refreshUser()} />
                      </div>
                    )}
                    {activeTab === 'referrals' && (
                      <ReferralTab isAuthenticated={isAuthenticated} onAuthClick={() => setShowAuthModal(true)} />
                    )}
                    {activeTab === 'activity' && (
                      <CreditActivityTab isAuthenticated={isAuthenticated} isActive={activeTab === 'activity'} onAuthClick={() => setShowAuthModal(true)} />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Buy credits link */}
                {onOpenPaywall && (
                  <div className="pt-4 pb-3">
                    <button
                      onClick={() => { onClose(); onOpenPaywall(); }}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span className="text-[13px] font-medium text-gray-600">Buy credit packs</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
        title="Sign in to continue"
        description="Create your account to unlock referrals, activity history, and reward tracking."
        showProBenefits={false}
      />
    </>
  );
}