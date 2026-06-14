// @file: MobileActionBar.tsx
// Enhanced mobile-first action bar with back navigation and improved UX

import React from 'react';
import {
  Loader2,
  Palette,
  Upload,
  X,
  ChevronLeft,
  Wand2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type StudioState = 'home' | 'discover' | 'upload' | 'ready' | 'processing' | 'results';

interface MobileActionBarProps {
  studioState: StudioState;
  selectedHairstyle: any;
  isGenerating: boolean;
  downloadLoading: boolean;
  isAuthenticated?: boolean;
  canGoBack?: boolean;
  onBack?: () => void;
  onDownload: () => void;
  onTryAnother: () => void;
  onGenerate: () => void;
  onShowGallery: () => void;
  handleUploadHairstyle: () => void;
  handleClearCustom: () => void;
  generateCustomHairstyle: (file: any, path: any) => void;
  customThumbnailPath: any;
  customImageFile: any;
}

// Safe area wrapper — frosted glass matching bottom nav
const SafeBottomBar = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    style={{ bottom: 'var(--mobile-tabbar-height, 0px)' }}
    className={cn(
      'fixed inset-x-0 lg:hidden z-40',
      'bg-white border-t border-black/[0.04]',
      className
    )}
  >
    <div className="px-4 py-2.5">
      {children}
    </div>
  </div>
);

// Back button
const BackButton = ({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 transition-colors"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>
);

// Selected style chip — minimal
const StylePreview = ({
  thumbnail,
  name,
  price,
  isCustom,
  onClear,
}: {
  thumbnail: string;
  name: string;
  price: number;
  isCustom?: boolean;
  onClear?: () => void;
}) => (
  <div className="flex items-center gap-2.5 bg-gray-50/80 rounded-xl pl-1 pr-3 py-1">
    <img
      src={thumbnail}
      alt={name}
      className="w-8 h-8 rounded-lg object-cover ring-1 ring-black/[0.06]"
    />
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-medium text-gray-800 truncate max-w-[120px]">
        {isCustom ? 'Custom Style' : name}
      </p>
      <p className="text-[11px] text-gray-400">
        {isCustom ? '3 credits' : `${price} credits`}
      </p>
    </div>
    {onClear && (
      <button
        onClick={onClear}
        className="w-6 h-6 rounded-full bg-gray-200/80 hover:bg-gray-300/80 flex items-center justify-center transition-colors"
        aria-label="Clear selection"
      >
        <X className="w-3 h-3 text-gray-500" />
      </button>
    )}
  </div>
);

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  studioState,
  selectedHairstyle,
  isGenerating,
  downloadLoading,
  isAuthenticated,
  canGoBack = false,
  onBack,
  onDownload,
  onTryAnother,
  onGenerate,
  onShowGallery,
  handleUploadHairstyle,
  generateCustomHairstyle,
  customThumbnailPath,
  customImageFile,
  handleClearCustom,
}) => {
  // Don't show during processing, on home, discover, upload, or on results (results has its own action sheet)
  if (studioState === 'processing' || studioState === 'home' || studioState === 'discover' || studioState === 'results' || studioState === 'upload') {
    return null;
  }

  // --- State: 'ready' ---
  if (studioState === 'ready') {
    // Custom hairstyle uploaded
    if (customThumbnailPath) {
      return (
        <SafeBottomBar>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <StylePreview
                thumbnail={customThumbnailPath}
                name="Custom Style"
                price={3}
                isCustom
                onClear={handleClearCustom}
              />
              <button
                onClick={handleUploadHairstyle}
                className="text-[13px] font-medium text-gray-400 hover:text-gray-600 px-2 py-1 transition-colors"
              >
                Change
              </button>
            </div>
            <div className="flex items-center gap-2">
              {canGoBack && onBack && <BackButton onClick={onBack} />}
              <button
                onClick={() => generateCustomHairstyle(customImageFile, customThumbnailPath)}
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-[#1a1a1a] text-white text-[14px] font-semibold shadow-sm active:scale-[0.97] transition-transform disabled:opacity-40"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </SafeBottomBar>
      );
    }

    // Standard hairstyle selected
    if (selectedHairstyle) {
      return (
        <SafeBottomBar>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <StylePreview
                thumbnail={selectedHairstyle.thumbnail}
                name={selectedHairstyle.name}
                price={selectedHairstyle.price}
              />
              <button
                onClick={onShowGallery}
                className="text-[13px] font-medium text-gray-400 hover:text-gray-600 px-2 py-1 transition-colors"
              >
                Change
              </button>
            </div>
            <div className="flex items-center gap-2">
              {canGoBack && onBack && <BackButton onClick={onBack} />}
              <button
                onClick={onGenerate}
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-[#1a1a1a] text-white text-[14px] font-semibold shadow-sm active:scale-[0.97] transition-transform disabled:opacity-40"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </SafeBottomBar>
      );
    }

    // No hairstyle selected yet
    return (
      <SafeBottomBar>
        <div className="flex items-center gap-2">
          {canGoBack && onBack && <BackButton onClick={onBack} />}
          <button
            onClick={onShowGallery}
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-[#1a1a1a] text-white text-[14px] font-semibold shadow-sm active:scale-[0.97] transition-transform"
          >
            <Palette className="w-4 h-4" />
            Choose Hairstyle
          </button>
          <button
            onClick={handleUploadHairstyle}
            className="h-11 w-11 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-150 transition-colors"
            aria-label="Upload custom hairstyle"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </SafeBottomBar>
    );
  }

  return null;
};

export default MobileActionBar;