import React, { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Hairstyle } from '@/lib/api';

interface StyleCarouselProps {
  hairstyles: Hairstyle[];
  selectedId?: string;
  onSelect: (hairstyle: Hairstyle) => void;
  isLoading?: boolean;
}

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[100px]">
    <div className="aspect-[3/4] rounded-xl bg-gray-100 animate-pulse" />
    <div className="mt-1.5 h-3 w-16 bg-gray-100 rounded-md animate-pulse" />
  </div>
);

const SkeletonRow = () => (
  <div>
    <div className="flex items-center justify-between px-4 mb-2.5">
      <div className="h-3.5 w-24 bg-gray-100 rounded-md animate-pulse" />
      <div className="h-3 w-14 bg-gray-50 rounded-md animate-pulse" />
    </div>
    <div className="flex gap-2.5 overflow-hidden px-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

const StyleCard = ({
  style,
  isSelected,
  onSelect,
  index,
}: {
  style: Hairstyle;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) => (
  <motion.button
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03, duration: 0.3 }}
    onClick={onSelect}
    className={cn(
      'flex-shrink-0 w-[100px] text-left group',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-xl'
    )}
  >
    <div
      className={cn(
        'relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-200',
        isSelected
          ? 'ring-2 ring-[#1a1a1a] ring-offset-2'
          : 'ring-1 ring-black/[0.06] group-hover:ring-black/[0.12]'
      )}
    >
      <img
        src={style.thumbnail}
        alt={style.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Badges */}
      {style.isNew && (
        <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[9px] font-semibold text-gray-800">
          <Zap className="w-2.5 h-2.5" />
          New
        </span>
      )}
      {style.isPremium && (
        <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-md bg-white/90 backdrop-blur-sm">
          <Crown className="w-2.5 h-2.5 text-amber-500" />
        </span>
      )}

      {/* Selected check */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </div>

    {/* Label */}
    <p className={cn(
      'mt-1.5 text-[11px] font-medium truncate transition-colors',
      isSelected ? 'text-gray-900' : 'text-gray-500'
    )}>
      {style.name}
    </p>
  </motion.button>
);

export const StyleCarousel: React.FC<StyleCarouselProps> = ({
  hairstyles,
  selectedId,
  onSelect,
  isLoading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group by category, pick top styles
  const categorized = useMemo(() => {
    const cats = new Map<string, Hairstyle[]>();
    for (const h of hairstyles) {
      if (!h.isActive) continue;
      const cat = h.category || 'Popular';
      if (!cats.has(cat)) cats.set(cat, []);
      cats.get(cat)!.push(h);
    }
    // Sort each category by popularity
    for (const [, list] of cats) {
      list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    return cats;
  }, [hairstyles]);

  // Flat list: popular first, then by category
  const displayStyles = useMemo(() => {
    const all = [...hairstyles].filter(h => h.isActive);
    all.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    return all.slice(0, 20);
  }, [hairstyles]);

  const categories = useMemo(() => {
    return Array.from(categorized.keys()).slice(0, 5);
  }, [categorized]);

  if (isLoading || (!hairstyles.length)) {
    if (!isLoading) return null;
    return (
      <div className="mt-4 space-y-5">
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-5">
      {/* Popular / All styles row */}
      <div>
        <div className="flex items-center justify-between px-4 mb-2.5">
          <h3 className="text-[13px] font-semibold text-gray-800">Popular styles</h3>
          <span className="text-[11px] text-gray-400">{displayStyles.length} styles</span>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-2.5 overflow-x-auto px-4 pb-1 scrollbar-none pt-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {displayStyles.map((style, i) => (
            <StyleCard
              key={style.id}
              style={style}
              isSelected={selectedId === style.id}
              onSelect={() => onSelect(style)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Category rows */}
      {categories.slice(0, 2).map(cat => {
        const styles = categorized.get(cat);
        if (!styles || styles.length < 3) return null;
        return (
          <div key={cat}>
            <h3 className="text-[13px] font-semibold text-gray-800 px-4 mb-2.5">
              {cat}
            </h3>
            <div
              className="flex gap-2.5 overflow-x-auto px-4 pb-1 scrollbar-none pt-2"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {styles.slice(0, 12).map((style, i) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  isSelected={selectedId === style.id}
                  onSelect={() => onSelect(style)}
                  index={i}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
