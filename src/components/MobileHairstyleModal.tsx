import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHairstyles } from '@/hooks/useHairstyles';
import { useDebounce } from '@/hooks/useDebounce';
import { apiService, type Hairstyle } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  Search,
  Coins,
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileHairstyleModalProps {
  isOpen: boolean;
  isDesktop?: boolean;
  setShowPricing: (value: boolean) => void;
  onClose: () => void;
  onHairstyleSelect: (hairstyle: Hairstyle) => void;
  selectedHairstyle: Hairstyle | null;
  userCredits?: number;
  hairstyles?: Hairstyle[];
}

interface Category {
  name: string;
  count: number;
}

const triggerHapticFeedback = async (style: ImpactStyle = ImpactStyle.Light) => {
  try { await Haptics.impact({ style }); } catch {}
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

const CardSkeleton = () => (
  <div className="flex flex-col">
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  </div>
);

// ── Style Card ────────────────────────────────────────────────────────────────

const StyleCard = React.memo(({
  hairstyle,
  isSelected,
  canAfford,
  onSelect,
  onShowPricing,
}: {
  hairstyle: Hairstyle;
  isSelected: boolean;
  canAfford: boolean;
  onSelect: () => void;
  onShowPricing: () => void;
}) => {
  const handleClick = useCallback(() => {
    triggerHapticFeedback();
    if (hairstyle.isCustom || canAfford) {
      onSelect();
    } else {
      onShowPricing();
    }
  }, [hairstyle.isCustom, canAfford, onSelect, onShowPricing]);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onClick={handleClick}
      className={cn(
        'text-left group focus:outline-none transition-all',
        !canAfford && !hairstyle.isCustom && 'opacity-50'
      )}
    >
      <div
        className={cn(
          'relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-200',
          isSelected
            ? 'ring-[2.5px] ring-[#1a1a1a] ring-offset-1'
            : 'ring-1 ring-black/[0.06]'
        )}
      >
        <img
          src={hairstyle.thumbnail}
          alt={hairstyle.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-active:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        {/* Price chip */}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/35 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          <Coins className="w-2.5 h-2.5 text-amber-300" />
          {hairstyle.price}
        </div>

        {/* Badges */}
        {hairstyle.isNew && (
          <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm text-[8px] font-bold text-gray-800 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            <Zap className="w-2 h-2" /> New
          </span>
        )}

        {hairstyle.isPremium && !hairstyle.isNew && (
          <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-amber-400/90 backdrop-blur-sm text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            <Crown className="w-2 h-2" /> Pro
          </span>
        )}

        {/* Locked overlay */}
        {!canAfford && !hairstyle.isCustom && (
          <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        )}

        {/* Selected check */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-sm"
          >
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}

        {/* Name */}
        <p className="absolute bottom-1.5 left-1.5 right-7 text-[10px] font-semibold text-white leading-tight line-clamp-2">
          {hairstyle.isCustom ? 'Custom Style' : hairstyle.name}
        </p>
      </div>
    </motion.button>
  );
});
StyleCard.displayName = 'StyleCard';

// ── Filter Chip ───────────────────────────────────────────────────────────────

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex-shrink-0 h-7 px-3 rounded-full text-[11px] font-semibold transition-all duration-150',
      active
        ? 'bg-[#1a1a1a] text-white shadow-sm'
        : 'bg-gray-100/80 text-gray-500 active:bg-gray-200'
    )}
  >
    {label}
  </button>
);

// ── Main Modal ────────────────────────────────────────────────────────────────

export default function MobileHairstyleModal({
  isOpen,
  onClose,
  onHairstyleSelect,
  selectedHairstyle,
  setShowPricing,
  userCredits = 0,
}: MobileHairstyleModalProps) {
  const [activeTab, setActiveTab] = useState<'default' | 'custom'>('default');
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    category: 'All',
    gender: 'All',
    feature: 'All',
    sort: 'popularity',
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const defaultHook = useHairstyles({
    category: filters.category,
    gender: filters.gender,
    feature: filters.feature,
    search: debouncedSearch,
    sort: filters.sort,
    limit: 18,
    type: 'default',
    autoLoad: activeTab === 'default',
  });

  const customHook = useHairstyles({
    search: debouncedSearch,
    sort: 'newest',
    limit: 18,
    type: 'custom',
    autoLoad: activeTab === 'custom',
  });

  const currentHook = activeTab === 'default' ? defaultHook : customHook;

  useEffect(() => {
    if (activeTab === 'default') {
      apiService.getHairstyleCategories().then(result => {
        if (result.success) {
          const totalCount = result.data.reduce((sum: number, cat: Category) => sum + cat.count, 0);
          setCategories([{ name: 'All', count: totalCount }, ...result.data]);
        }
      }).catch(() => {});
    }
  }, [activeTab]);

  const canAfford = useCallback((price: number) => userCredits >= price, [userCredits]);

  const handleStyleSelect = useCallback((hairstyle: Hairstyle) => {
    if (!hairstyle.isCustom && !canAfford(hairstyle.price)) return;
    onHairstyleSelect(hairstyle);
    onClose();
  }, [canAfford, onHairstyleSelect, onClose]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= currentHook.totalPages) {
      currentHook.setPage(newPage);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentHook]);

  const genderOptions = ['All', 'Female', 'Male', 'Unisex'];
  const featureOptions = [
    { value: 'All', label: 'All' },
    { value: 'Trending', label: '🔥 Trending' },
    { value: 'Premium', label: '👑 Premium' },
    { value: 'Basic', label: 'Starter' },
  ];

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
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 350 }}
            className={cn(
              'fixed z-50 bg-white flex flex-col overflow-hidden',
              'inset-x-0 bottom-0 h-[92vh] rounded-t-[24px]',
              'lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2',
              'lg:w-full lg:max-w-3xl lg:h-[88vh] lg:rounded-[24px]',
            )}
          >
            {/* ── Handle + Header ─────────────────────────────── */}
            <div className="flex-shrink-0">
              <div className="flex justify-center pt-2 pb-0.5">
                <div className="w-8 h-[3px] rounded-full bg-gray-200" />
              </div>

              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">
                  Choose Style
                </h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ── Search ─────────────────────────────────────── */}
              <div className="px-4 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search styles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-8 rounded-lg bg-gray-50 text-[13px] text-gray-700 placeholder:text-gray-300 border-0 ring-1 ring-black/[0.04] focus:ring-[#1a1a1a] focus:ring-1 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <X className="w-2.5 h-2.5 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* ── Tabs ───────────────────────────────────────── */}
              <div className="relative px-4">
                <div className="flex">
                  {(['default', 'custom'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                      className={cn(
                        'relative pb-2 text-[13px] font-semibold transition-colors duration-200',
                        tab === 'default' ? 'mr-6' : '',
                        activeTab === tab
                          ? 'text-gray-900'
                          : 'text-gray-300'
                      )}
                    >
                      {tab === 'default' ? 'All Styles' : 'My Uploads'}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a] rounded-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-gray-100" />
              </div>

              {/* ── Filters ────────────────────────────────────── */}
              {activeTab === 'default' && (
                <div className="px-4 pt-2 pb-2 space-y-1.5">
                  {/* Gender + Feature in one row */}
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                    {genderOptions.map(g => (
                      <Chip
                        key={g}
                        label={g}
                        active={filters.gender === g}
                        onClick={() => setFilters(prev => ({ ...prev, gender: g }))}
                      />
                    ))}
                    <div className="w-px h-7 bg-gray-100 flex-shrink-0" />
                    {featureOptions.map(f => (
                      <Chip
                        key={f.value}
                        label={f.label}
                        active={filters.feature === f.value}
                        onClick={() => setFilters(prev => ({ ...prev, feature: f.value }))}
                      />
                    ))}
                  </div>

                  {/* Category row */}
                  {categories.length > 1 && (
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                      {categories.map(cat => (
                        <Chip
                          key={cat.name}
                          label={cat.name === 'All' ? `All (${cat.count})` : cat.name}
                          active={filters.category === cat.name}
                          onClick={() => setFilters(prev => ({ ...prev, category: cat.name }))}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Grid Content ──────────────────────────────── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-3 pb-4">
              {/* Loading */}
              {currentHook.isLoading && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Error */}
              {currentHook.error && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-3">
                    <X className="w-4.5 h-4.5 text-red-400" />
                  </div>
                  <p className="text-[13px] font-semibold text-gray-800">
                    Couldn&apos;t load styles
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 text-center max-w-[200px]">
                    Check your connection and try again
                  </p>
                  <button
                    onClick={() => currentHook.setPage(currentHook.currentPage)}
                    className="mt-4 h-8 px-4 rounded-full bg-[#1a1a1a] text-white text-[11px] font-semibold flex items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              )}

              {/* Results */}
              {!currentHook.isLoading && !currentHook.error && (
                <>
                  {currentHook.hairstyles.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <AnimatePresence mode="popLayout">
                        {currentHook.hairstyles.map(hairstyle => (
                          <StyleCard
                            key={hairstyle._id}
                            hairstyle={hairstyle}
                            isSelected={selectedHairstyle?._id === hairstyle._id}
                            canAfford={canAfford(hairstyle.price)}
                            onSelect={() => handleStyleSelect(hairstyle)}
                            onShowPricing={() => setShowPricing(true)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <Search className="w-4.5 h-4.5 text-gray-300" />
                      </div>
                      <p className="text-[13px] font-semibold text-gray-800">No styles found</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Try different filters</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Pagination ────────────────────────────────── */}
            {!currentHook.isLoading && currentHook.totalPages > 1 && (
              <div className="flex-shrink-0 px-4 py-2 border-t border-gray-100 flex items-center justify-between bg-white">
                <button
                  onClick={() => handlePageChange(currentHook.currentPage - 1)}
                  disabled={currentHook.currentPage === 1}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center disabled:opacity-25 transition-opacity active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(currentHook.totalPages, 5) }).map((_, i) => {
                    const page = currentHook.totalPages <= 5
                      ? i + 1
                      : Math.max(1, Math.min(currentHook.currentPage - 2, currentHook.totalPages - 4)) + i;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          'w-7 h-7 rounded-full text-[11px] font-semibold transition-all',
                          currentHook.currentPage === page
                            ? 'bg-[#1a1a1a] text-white'
                            : 'text-gray-400 hover:bg-gray-50'
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentHook.currentPage + 1)}
                  disabled={currentHook.currentPage === currentHook.totalPages}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center disabled:opacity-25 transition-opacity active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}