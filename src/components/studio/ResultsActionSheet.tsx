// ResultsActionSheet â€” mobile bottom sheet for result actions
// Design: frosted glass, dark CTAs, native buttons, no shadcn

import React from 'react';
import {
  Share2,
  Download,
  RotateCcw,
  Crown,
  Lock,
  Loader2,
  RefreshCw,
  Scissors,
  ArrowUpRight,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultsActionSheetProps {
  isOpen: boolean;
  isPro: boolean;
  isGuest?: boolean;
  onShareCollage: () => void;
  onShareImage: () => void;
  onExport: (clean: boolean) => void;
  onTryAnother: () => void;
  onRetrySameStyle?: () => void;
  onBarberExport?: () => void;
  onUpgrade: () => void;
  onShowAuth?: () => void;
  isExporting?: boolean;
  isCreatingCollage?: boolean;
  isCreatingBarberCard?: boolean;
}

const haptic = async (style: ImpactStyle = ImpactStyle.Light) => {
  try { if (Capacitor.isNativePlatform()) await Haptics.impact({ style }); } catch {}
};

/* â”€â”€â”€ Row action button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ActionRow = ({
  icon: Icon,
  label,
  desc,
  onClick,
  variant = 'default',
  disabled = false,
  loading = false,
  right,
}: {
  icon: React.ElementType;
  label: string;
  desc?: string;
  onClick: () => void;
  variant?: 'primary' | 'default' | 'subtle';
  disabled?: boolean;
  loading?: boolean;
  right?: React.ReactNode;
}) => {
  const base = 'flex items-center gap-3.5 w-full min-h-[52px] px-4 py-3 rounded-2xl transition-all active:scale-[0.98]';
  const variants = {
    primary: 'bg-[#1a1a1a] text-white',
    default: 'bg-gray-50 text-gray-800 ring-1 ring-black/[0.04]',
    subtle: 'bg-transparent text-gray-500 hover:bg-gray-50',
  };

  return (
    <button
      onClick={() => { haptic(); onClick(); }}
      disabled={disabled || loading}
      className={cn(base, variants[variant], disabled && 'opacity-50 cursor-not-allowed')}
    >
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
        variant === 'primary' ? 'bg-white/15' : 'bg-white shadow-sm ring-1 ring-black/[0.04]'
      )}>
        {loading ? (
          <Loader2 className={cn('w-[18px] h-[18px] animate-spin', variant === 'primary' ? 'text-white/80' : 'text-gray-400')} />
        ) : (
          <Icon className={cn('w-[18px] h-[18px]', variant === 'primary' ? 'text-white' : 'text-gray-600')} />
        )}
      </div>
      <div className="flex-1 text-left min-w-0">
        <span className="font-semibold text-[15px] leading-tight">{label}</span>
        {desc && <p className={cn('text-xs mt-0.5 leading-tight', variant === 'primary' ? 'text-white/60' : 'text-gray-400')}>{desc}</p>}
      </div>
      {right}
    </button>
  );
};

/* â”€â”€â”€ Pill badges â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ProBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-wider">
    <Crown className="w-2.5 h-2.5" /> Pro
  </span>
);
const FreeBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 text-[10px] font-medium">
    <Lock className="w-2.5 h-2.5" /> Watermarked
  </span>
);

/* â”€â”€â”€ Bottom sheet (mobile) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const ResultsActionSheet: React.FC<ResultsActionSheetProps> = ({
  isOpen,
  isPro,
  isGuest = false,
  onShareCollage,
  onShareImage,
  onExport,
  onTryAnother,
  onRetrySameStyle,
  onBarberExport,
  onUpgrade,
  onShowAuth,
  isExporting = false,
  isCreatingCollage = false,
  isCreatingBarberCard = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden">
      <div className={cn(
        'bg-white rounded-t-3xl',
        'border-t border-black/[0.04]',
        'pb-4'
      )}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em]">Your look is ready</p>
        </div>

        <div className="px-4 space-y-2">
          {/* â”€â”€â”€ Quick actions: Retry + New style â”€â”€â”€ */}
          <div className="grid grid-cols-2 gap-2">
            {onRetrySameStyle && (
              <ActionRow
                icon={RefreshCw}
                label="Regenerate"
                onClick={onRetrySameStyle}
                variant="default"
              />
            )}
            <ActionRow
              icon={RotateCcw}
              label="New Style"
              onClick={onTryAnother}
              variant="default"
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-black/[0.04] my-1" />

          {/* â”€â”€â”€ Share section â”€â”€â”€ */}
          <ActionRow
            icon={Share2}
            label="Share Before & After"
            desc="Side-by-side collage"
            onClick={onShareCollage}
            variant="primary"
            loading={isCreatingCollage}
          />

          <ActionRow
            icon={ArrowUpRight}
            label="Share Image"
            desc="Just your new look"
            onClick={onShareImage}
          />

          {/* â”€â”€â”€ Save section â”€â”€â”€ */}
          <div className="pt-1">
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-[0.12em] px-1 mb-2">Save</p>

            {isPro ? (
              <ActionRow
                icon={Download}
                label="Download HD"
                desc="High quality, no watermark"
                onClick={() => onExport(true)}
                loading={isExporting}
                right={<ProBadge />}
              />
            ) : (
              <div className="space-y-2">
                <ActionRow
                  icon={Download}
                  label="Download"
                  onClick={() => onExport(false)}
                  loading={isExporting}
                  right={<FreeBadge />}
                />
                <button
                  onClick={() => { haptic(ImpactStyle.Medium); onUpgrade(); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-gray-50 ring-1 ring-black/[0.04] transition-all active:scale-[0.98]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                    <Crown className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="flex-1 text-left text-xs font-semibold text-gray-500">
                    Upgrade for HD without watermark
                  </p>
                </button>
              </div>
            )}
          </div>

          {/* â”€â”€â”€ Barber card â”€â”€â”€ */}
          {onBarberExport && (
            <ActionRow
              icon={Scissors}
              label="Show Your Stylist"
              desc="Export a card with style name"
              onClick={onBarberExport}
              loading={isCreatingBarberCard}
            />
          )}

          {/* â”€â”€â”€ Guest sign-in â”€â”€â”€ */}
          {isGuest && onShowAuth && (
            <button
              onClick={() => { haptic(); onShowAuth!(); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-[#1a1a1a] text-white transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <LogIn className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-[15px]">Sign in to save</p>
                <p className="text-xs text-white/50">Keep your looks & earn rewards</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* â”€â”€â”€ Desktop variant â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const ResultsActionsDesktop: React.FC<ResultsActionSheetProps> = ({
  isPro,
  onShareCollage,
  onShareImage,
  onExport,
  onTryAnother,
  onUpgrade,
  isExporting = false,
  isCreatingCollage = false,
}) => {
  return (
    <div className="hidden lg:block p-5 bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-4">Actions</p>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onShareCollage}
            disabled={isCreatingCollage}
            className="h-12 rounded-xl bg-[#1a1a1a] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#2a2a2a] active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {isCreatingCollage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            Collage
          </button>
          <button
            onClick={onShareImage}
            className="h-12 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.98] transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            Share
          </button>
        </div>

        <button
          onClick={() => onExport(isPro)}
          disabled={isExporting}
          className="w-full h-12 rounded-xl bg-gray-50 ring-1 ring-black/[0.04] text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50 transition-all"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isPro ? 'Download HD' : 'Download (Watermarked)'}
        </button>

        {!isPro && (
          <button
            onClick={onUpgrade}
            className="w-full p-3 rounded-xl bg-gray-50 ring-1 ring-black/[0.04] text-left flex items-center gap-3 hover:bg-gray-100 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
              <Crown className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-500">Upgrade for HD exports</span>
          </button>
        )}

        <div className="h-px bg-black/[0.04]" />

        <button
          onClick={onTryAnother}
          className="w-full h-12 rounded-xl text-gray-400 font-semibold text-sm flex items-center justify-center gap-2 hover:text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Try Another Style
        </button>
      </div>
    </div>
  );
};

export default ResultsActionSheet;
