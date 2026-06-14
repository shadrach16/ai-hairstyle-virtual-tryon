// G1: Saved Looks gallery — renders user's curated saved generations
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiService, SavedLook, SavedLookCollection, Generation } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Bookmark,
  Star,
  Pin,
  Trash2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Clock,
  ImageIcon,
  X,
  Share2,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { toast } from 'sonner';
import { HistorySkeleton } from '@/components/skeletons';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedLooksPageProps {
  embedded?: boolean;
  onShowAuth?: () => void;
  onStartTryOn?: () => void;
}

const triggerHaptic = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch (e) {}
};

// ─── Saved Look Card ────────────────────────────────────────────────────

const SavedLookCard: React.FC<{
  look: SavedLook;
  index: number;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, pinned: boolean) => void;
  onView: (imageUrl: string, title: string) => void;
}> = ({ look, index, onDelete, onTogglePin, onView }) => {
  const imageUrl = look.snapshot?.generatedImageUrl || look.snapshot?.originalImageUrl;
  const ratingStars = look.snapshot?.rating || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm shadow-gray-200/60 ring-1 ring-black/[0.04] cursor-pointer"
      onClick={() => {
        const url = look.snapshot?.generatedImageUrl || look.snapshot?.originalImageUrl;
        if (url) onView(url, look.title || look.snapshot?.hairstyleName || 'Saved Look');
      }}
    >
      {/* Image */}
      <div className="aspect-[3/4] relative bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={look.title || look.snapshot?.hairstyleName || 'Saved look'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-200" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

        {/* Pin badge */}
        {look.isPinned && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
            <Pin className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-semibold text-amber-700">Pinned</span>
          </div>
        )}

        {/* Action buttons — visible on hover/touch */}
        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-150">
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic();
              onTogglePin(look._id, !look.isPinned);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            aria-label={look.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className={cn('w-3.5 h-3.5', look.isPinned ? 'text-amber-500' : 'text-gray-500')} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic();
              onDelete(look._id);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            aria-label="Remove"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>

        {/* Bottom text overlay */}
        <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
          <p className="text-[13px] font-semibold text-white truncate drop-shadow-sm">
            {look.title || look.snapshot?.hairstyleName || 'Untitled'}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {look.snapshot?.hairstyleCategory && (
              <span className="text-[11px] text-white/70">
                {look.snapshot.hairstyleCategory}
              </span>
            )}
            {ratingStars > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span className="text-[11px] text-white/80 font-medium">{ratingStars}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Collection Filter Chips ────────────────────────────────────────────

const CollectionChips: React.FC<{
  collections: SavedLookCollection[];
  active: string | null;
  onSelect: (collection: string | null) => void;
}> = ({ collections, active, onSelect }) => (
  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none px-5">
    <button
      onClick={() => { triggerHaptic(); onSelect(null); }}
      className={cn(
        'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
        !active
          ? 'bg-[#1a1a1a] text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-150 active:scale-[0.97]'
      )}
    >
      All
    </button>
    {collections.map((c) => (
      <button
        key={c.collection}
        onClick={() => { triggerHaptic(); onSelect(c.collection); }}
        className={cn(
          'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
          active === c.collection
            ? 'bg-[#1a1a1a] text-white shadow-sm'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-150 active:scale-[0.97]'
        )}
      >
        {c.collection} <span className="text-[10px] opacity-60 ml-0.5">{c.count}</span>
      </button>
    ))}
  </div>
);

// ─── Generation History Card ────────────────────────────────────────────

const HistoryCard: React.FC<{ generation: Generation; index: number; onView: (imageUrl: string, title: string) => void }> = ({ generation, index, onView }) => {
  const imageUrl = generation.generatedImageUrl || (generation as any).generatedImage?.url;
  const styleName = generation.hairstyle?.name || 'Unknown Style';
  const date = new Date(generation.createdAt);
  const isCompleted = generation.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-gray-200/60 ring-1 ring-black/[0.04] cursor-pointer"
      onClick={() => {
        if (imageUrl) onView(imageUrl, styleName);
      }}
    >
      <div className="aspect-[3/4] relative bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={styleName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-200" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

        {/* Status badge */}
        {!isCompleted && (
          <div className="absolute top-2.5 right-2.5">
            <span className={cn(
              'text-[10px] px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm',
              generation.status === 'failed'
                ? 'bg-red-500/80 text-white'
                : 'bg-blue-500/80 text-white'
            )}>
              {generation.status}
            </span>
          </div>
        )}

        {/* Bottom text overlay */}
        <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
          <p className="text-[13px] font-semibold text-white truncate drop-shadow-sm">{styleName}</p>
          <p className="text-[11px] text-white/60 mt-0.5">
            {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Empty State Component ──────────────────────────────────────────────

const EmptyState: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="flex flex-col items-center justify-center py-20 px-6 text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
      <Icon className="w-7 h-7 text-gray-300" />
    </div>
    <p className="text-base font-semibold text-gray-800 tracking-tight">{title}</p>
    <p className="text-sm text-gray-400 mt-1.5 max-w-[260px] leading-relaxed">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-6 px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-sm font-semibold shadow-sm active:scale-[0.97] transition-transform"
      >
        {actionLabel}
      </button>
    )}
  </motion.div>
);

// ─── Pagination ─────────────────────────────────────────────────────────

const Pagination: React.FC<{
  current: number;
  total: number;
  onChange: (page: number) => void;
}> = ({ current, total, onChange }) => (
  <div className="flex items-center justify-center gap-3 py-6">
    <button
      onClick={() => onChange(Math.max(1, current - 1))}
      disabled={current === 1}
      className="w-9 h-9 rounded-xl bg-white ring-1 ring-black/[0.06] flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform"
    >
      <ChevronLeft className="w-4 h-4 text-gray-600" />
    </button>
    <span className="text-xs font-medium text-gray-400 tabular-nums">
      {current} / {total}
    </span>
    <button
      onClick={() => onChange(Math.min(total, current + 1))}
      disabled={current === total}
      className="w-9 h-9 rounded-xl bg-white ring-1 ring-black/[0.06] flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform"
    >
      <ChevronRight className="w-4 h-4 text-gray-600" />
    </button>
  </div>
);

// ─── Image Lightbox ─────────────────────────────────────────────────────

const ImageLightbox: React.FC<{
  imageUrl: string;
  title: string;
  onClose: () => void;
}> = ({ imageUrl, title, onClose }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const toBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => resolve((r.result as string).split(',')[1]);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
      const resp = await fetch(imageUrl);
      const blob = await resp.blob();
      if (Capacitor.isNativePlatform()) {
        const b64 = await toBase64(blob);
        const fn = `hairstyle_${Date.now()}.jpg`;
        await Filesystem.writeFile({ path: fn, data: b64, directory: Directory.Cache, recursive: true });
        const { uri } = await Filesystem.getUri({ path: fn, directory: Directory.Cache });
        await Share.share({
          title: title || 'My Hairstyle',
          text: `Check out this hairstyle: ${title || 'My Look'} — made with Hair Studio AI`,
          dialogTitle: 'Share Hairstyle',
          files: [uri],
        });
        setTimeout(async () => { try { await Filesystem.deleteFile({ path: fn, directory: Directory.Cache }); } catch {} }, 2000);
      } else {
        const file = new File([blob], 'hairstyle.jpg', { type: 'image/jpeg' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: title || 'My Hairstyle', files: [file] });
        } else {
          toast.info('Sharing not supported on this browser');
        }
      }
    } catch (e: any) {
      const msg = String(e?.message || e || '').toLowerCase();
      if (msg.includes('cancel') || msg.includes('abort')) { toast.info('Share cancelled'); }
      else { toast.error('Failed to share'); }
    } finally { setIsSharing(false); }
  };

  const handleDownload = async () => {
    setIsSaving(true);
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
      const fname = `Hair_Studio_${title || 'look'}_${Date.now()}.jpg`.replace(/\s+/g, '_');
      const resp = await fetch(imageUrl);
      const blob = await resp.blob();
      if (Capacitor.isNativePlatform()) {
        const b64 = await toBase64(blob);
        try {
          await Filesystem.writeFile({ path: `Download/HairStudio/${fname}`, data: b64, directory: Directory.ExternalStorage, recursive: true });
        } catch {
          await Filesystem.writeFile({ path: fname, data: b64, directory: Directory.Documents, recursive: true });
        }
        toast.success('Saved to Downloads/HairStudio');
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = fname;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        toast.success('Image downloaded');
      }
    } catch {
      toast.error('Failed to save');
    } finally { setIsSaving(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Image */}
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        src={imageUrl}
        alt={title}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[92vw] max-h-[70vh] object-contain rounded-2xl shadow-2xl"
      />

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="mt-3 text-sm font-medium text-white/70 text-center px-4 truncate max-w-[80vw]"
      >
        {title}
      </motion.p>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.25 }}
        className="mt-4 flex gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDownload}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium active:scale-95 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium active:scale-95 transition-all disabled:opacity-50"
        >
          <Share2 className="w-4 h-4" />
          {isSharing ? 'Sharing...' : 'Share'}
        </button>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────

export default function SavedLooksPage({ embedded = false, onShowAuth, onStartTryOn }: SavedLooksPageProps) {
  const { isAuthenticated } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'history'>('saved');
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [collections, setCollections] = useState<SavedLookCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // History state
  const [historyGenerations, setHistoryGenerations] = useState<Generation[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [lightbox, setLightbox] = useState<{ imageUrl: string; title: string } | null>(null);

  const fetchLooks = useCallback(async (page: number, collection: string | null) => {
    setIsLoading(true);
    try {
      const [looksRes, collectionsRes] = await Promise.all([
        apiService.getSavedLooks({
          page,
          limit: 20,
          ...(collection ? { collection } : {}),
        }),
        apiService.getSavedLookCollections(),
      ]);
      if (looksRes.success) {
        setLooks(looksRes.data || []);
        if (looksRes.pagination) {
          setTotalPages(looksRes.pagination.pages);
        }
      }
      if (collectionsRes.success) {
        setCollections(collectionsRes.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch saved looks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLooks(currentPage, activeCollection);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentPage, activeCollection, fetchLooks]);

  const fetchHistory = useCallback(async (page: number) => {
    setIsHistoryLoading(true);
    try {
      const res = await apiService.getGenerationHistory({ page, limit: 20, sort: '-createdAt' });
      if (res.success) {
        setHistoryGenerations(res.data || []);
        if (res.pagination) setHistoryTotalPages(res.pagination.pages);
      }
    } catch {
      console.error('Failed to fetch history');
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeSubTab === 'history') {
      fetchHistory(historyPage);
    }
  }, [isAuthenticated, activeSubTab, historyPage, fetchHistory]);

  useEffect(() => {
    apiService.trackEvent('page_view', { page: 'saved_looks' });
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    triggerHaptic();
    const result = await apiService.deleteSavedLook(id);
    if (result.success) {
      setLooks((prev) => prev.filter((l) => l._id !== id));
      toast.success('Look removed');
    } else {
      toast.error(result.message || 'Failed to remove');
    }
  }, []);

  const handleTogglePin = useCallback(async (id: string, pinned: boolean) => {
    const result = await apiService.updateSavedLook(id, { isPinned: pinned });
    if (result.success && result.data) {
      setLooks((prev) => prev.map((l) => (l._id === id ? { ...l, isPinned: pinned } : l)));
      toast.success(pinned ? 'Pinned' : 'Unpinned');
    }
  }, []);

  const handleCollectionChange = useCallback((collection: string | null) => {
    setActiveCollection(collection);
    setCurrentPage(1);
  }, []);

  // ── Signed-out state ─────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center justify-center min-h-[65vh] px-8 text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-6 shadow-sm">
          <Bookmark className="w-9 h-9 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Your Looks</h2>
        <p className="text-sm text-gray-400 mt-2 max-w-[260px] leading-relaxed">
          Sign in to save your favourite try-ons and build your personal lookbook.
        </p>
        <button
          onClick={onShowAuth}
          className="mt-8 flex items-center gap-2.5 px-8 py-3 rounded-2xl bg-white text-gray-800 text-sm font-semibold shadow-lg shadow-gray-900/8 ring-1 ring-black/[0.08] active:scale-[0.97] transition-transform"
        >
          <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="-0.5 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M9.827,24 C9.827,22.476 10.08,21.014 10.532,19.644 L2.623,13.604 C1.082,16.734 0.214,20.26 0.214,24 C0.214,27.737 1.081,31.261 2.62,34.388 L10.525,28.337 C10.077,26.973 9.827,25.517 9.827,24" fill="#FBBC05"/><path d="M23.714,10.133 C27.025,10.133 30.016,11.307 32.366,13.227 L39.202,6.4 C35.036,2.773 29.695,0.533 23.714,0.533 C14.427,0.533 6.445,5.844 2.623,13.604 L10.532,19.644 C12.355,14.112 17.549,10.133 23.714,10.133" fill="#EB4335"/><path d="M23.714,37.867 C17.549,37.867 12.355,33.888 10.532,28.356 L2.623,34.395 C6.445,42.156 14.427,47.467 23.714,47.467 C29.445,47.467 34.918,45.431 39.025,41.618 L31.518,35.814 C29.4,37.149 26.732,37.867 23.714,37.867" fill="#34A853"/><path d="M46.145,24 C46.145,22.613 45.932,21.12 45.611,19.733 L23.714,19.733 L23.714,28.8 L36.318,28.8 C35.688,31.891 33.972,34.268 31.518,35.814 L39.025,41.618 C43.339,37.614 46.145,31.649 46.145,24" fill="#4285F4"/></svg>
          Sign in with Google
        </button>
      </motion.div>
    );
  }

  // ── Signed-in state ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[#faf9f7]">
      {/* Header */}
      <div className={cn('px-3', embedded ? 'pt-5 pb-3' : 'sticky top-0 z-10 bg-[#faf9f7] pt-5 pb-3')}>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">My Looks</h1>

        {/* Sub-tab toggle */}
        <div className="flex gap-1 mt-3 p-1 bg-gray-100/80 rounded-2xl">
          {(['saved', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { triggerHaptic(); setActiveSubTab(tab); }}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200',
                activeSubTab === tab
                  ? 'bg-white text-gray-900 shadow-sm shadow-gray-200/50'
                  : 'text-gray-400'
              )}
            >
              {tab === 'saved' ? <Bookmark className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {tab === 'saved' ? 'Saved' : 'History'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Saved tab ── */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Count + collection chips */}
            <div className="px-5 pt-1 pb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">
                {looks.length} look{looks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {collections.length > 0 && (
              <div className="pb-2">
                <CollectionChips
                  collections={collections}
                  active={activeCollection}
                  onSelect={handleCollectionChange}
                />
              </div>
            )}

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pb-4 px-3">
              {isLoading ? (
                <HistorySkeleton count={6} />
              ) : looks.length === 0 ? (
                <EmptyState
                  icon={Layers}
                  title="No Saved Looks Yet"
                  description="After a try-on, tap Save to add looks to your personal collection."
                  actionLabel="Start Try-On"
                  onAction={onStartTryOn}
                />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {looks.map((look, i) => (
                      <SavedLookCard
                        key={look._id}
                        look={look}
                        index={i}
                        onDelete={handleDelete}
                        onTogglePin={handleTogglePin}
                        onView={(url, title) => setLightbox({ imageUrl: url, title })}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ── History tab ── */}
        {activeSubTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto px-4 pb-4 pt-2"
          >
            {isHistoryLoading ? (
              <HistorySkeleton count={6} />
            ) : historyGenerations.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No History Yet"
                description="Your generation history appears here after you try on a hairstyle."
                actionLabel="Start Try-On"
                onAction={onStartTryOn}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {historyGenerations.map((gen, i) => (
                    <HistoryCard key={gen.id} generation={gen} index={i} onView={(url, title) => setLightbox({ imageUrl: url, title })} />
                  ))}
                </div>
                {historyTotalPages > 1 && (
                  <Pagination current={historyPage} total={historyTotalPages} onChange={setHistoryPage} />
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen image lightbox */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            imageUrl={lightbox.imageUrl}
            title={lightbox.title}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
