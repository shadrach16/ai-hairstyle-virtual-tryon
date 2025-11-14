import React, { useState, useEffect } from 'react';
import { Loader2, Share2 } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { toast } from 'sonner';

interface ResultsViewerProps {
  selectedPhoto: File | null;
  selectedHairstyle: { name: string } | null;
  generationStatus: { generatedImageUrl: string | null } | null;
}

const ResultsViewer: React.FC<ResultsViewerProps> = ({
  selectedPhoto,
  generationStatus,
  selectedHairstyle,
}) => {
  const [beforeImageUrl, setBeforeImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'before' | 'after' | 'share_look'>('after');
  const [isAfterImageLoading, setIsAfterImageLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;

    if (selectedPhoto) {
      objectUrl = URL.createObjectURL(selectedPhoto);
      setBeforeImageUrl(objectUrl);
    } else {
      setBeforeImageUrl(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedPhoto]);

  const afterImageUrl = generationStatus?.generatedImageUrl;

  // Reset loading state when afterImageUrl changes
  useEffect(() => {
    if (afterImageUrl) {
      setIsAfterImageLoading(true);
    }
  }, [afterImageUrl]);

  const handleShare = async () => {
    if (!afterImageUrl) {
      toast.error('Image not available to share.');
      return;
    }

    const shareTitle = 'Check out my new look! ✨';
    const shareText = `I just tried the '${
      selectedHairstyle?.name || 'new'
    }' style using Hair Studio AI. What do you think?`;

    console.log('🚀 Starting share process...');
    const toastId = toast.loading('Preparing image...');

    try {
      // === NATIVE PLATFORM (iOS/Android) ===
      if (Capacitor.isNativePlatform()) {
        console.log('📱 Native platform detected');

        const response = await fetch(afterImageUrl);
        const blob = await response.blob();
        
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        console.log('✅ Image converted to base64');

        const fileName = `hairstyle_${Date.now()}.jpg`;
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache,
        });
        console.log(`📁 Saved as: ${fileName}`);

        const { uri: nativeFileUri } = await Filesystem.getUri({
          directory: Directory.Cache,
          path: fileName,
        });
        console.log(`📍 Native URI: ${nativeFileUri}`);

        toast.dismiss(toastId);

        await Share.share({
          title: shareTitle,
          text: shareText,
          dialogTitle: 'Share Your New Look',
          files: [nativeFileUri],
        });

        console.log('✅ Share completed');

        setTimeout(async () => {
          try {
            await Filesystem.deleteFile({
              path: fileName,
              directory: Directory.Cache,
            });
            console.log('🗑️ Temporary file deleted');
          } catch (err) {
            console.warn('⚠️ Could not delete temp file:', err);
          }
        }, 2000);

        return;
      }

      // === WEB PLATFORM ===
      console.log('🌐 Web platform detected');

      if (navigator.share && navigator.canShare) {
        const response = await fetch(afterImageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'hairstyle.jpg', { type: 'image/jpeg' });

        if (navigator.canShare({ files: [file] })) {
          toast.dismiss(toastId);
          await navigator.share({
            title: shareTitle,
            text: shareText,
            files: [file],
          });
          console.log('✅ Web share with file completed');
          return;
        }
      }

      console.log('📥 Falling back to download');
      toast.dismiss(toastId);
      
      const response = await fetch(afterImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hairstyle_${selectedHairstyle?.name || 'result'}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Image downloaded! Caption copied to clipboard.');
      } catch {
        toast.success('Image downloaded!');
      }

    } catch (error: any) {
      toast.dismiss(toastId);

      if (error.name === 'AbortError' || 
          error.message?.toLowerCase().includes('cancel')) {
        console.log('❌ Share cancelled by user');
        toast.info('Share cancelled');
        return;
      }

      console.error('❌ Share failed:', error);
      toast.error('Could not share image', {
        description: 'Please try again or download instead'
      });
    }
  };

  // LOADING STATE
  if (!beforeImageUrl || !afterImageUrl) {
    return (
      <div className="flex aspect-square w-full max-h-[70vh] items-center justify-center rounded-lg bg-gray-50 border">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 my-8" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto  shadow-sm bg-white overflow-hidden border border-gray-100  ">
      {/* Modern "Pill" Tab Control */}
      <div
        className="p-1.5 bg-gray-100 rounded-full flex max-w-md mx-auto my-4"
        role="tablist"
        aria-label="Image comparison"
      >
        <button
          onClick={() => setActiveTab('before')}
          className={`flex-1 py-2 px-4 rounded-full text-center text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
            activeTab === 'before'
              ? 'bg-white shadow text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          role="tab"
          aria-selected={activeTab === 'before'}
          aria-controls="image-panel"
        >
          Before
        </button>
        <button
          onClick={() => setActiveTab('after')}
          className={`flex-1 py-2 px-4 rounded-full text-center text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
            activeTab === 'after'
              ? 'bg-white shadow text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          role="tab"
          aria-selected={activeTab === 'after'}
          aria-controls="image-panel"
        >
          After
        </button>
      </div>

      {/* Image Viewer with Fade Transition */}
      <div
        className="relative aspect-square w-full bg-gray-100"
        id="image-panel"
        role="tabpanel"
      >
        {/* Before Image */}
        <img
          src={beforeImageUrl}
          alt="Original user photo"
          className="inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out"
          style={{ display: activeTab === 'before' ? '' : 'none' }}
        />
        
        {/* After Image with Loading Skeleton */}
        {activeTab === 'after' && (
          <>
            {/* Skeleton Loader */}
            {isAfterImageLoading && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto" />
                  <p className="text-sm text-gray-500 font-medium">Loading your new look...</p>
                </div>
              </div>
            )}
            
            {/* Actual After Image */}
            <img
              decoding="async"
              src={afterImageUrl}
              alt={`Generated hairstyle: ${selectedHairstyle?.name}`}
              className="inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out"
              style={{ 
                display: activeTab === 'after' ? '' : 'none',
                opacity: isAfterImageLoading ? 0 : 1
              }}
              onLoad={() => setIsAfterImageLoading(false)}
              onError={() => setIsAfterImageLoading(false)}
            />
          </>
        )}

        {/* Share Button (Shows only on 'After' tab and when image is loaded) */}
        <button
          onClick={handleShare}
          className={`absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full text-gray-800 backdrop-blur-sm shadow-md transition-all hover:bg-white hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
            activeTab === 'after' && !isAfterImageLoading
              ? 'opacity-100 visible'
              : 'opacity-0 invisible'
          }`}
          aria-label="Share result"
          title="Share your new hairstyle"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Structured "Card Footer" */}
      <div className="text-center p-5 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
          Selected Style
        </p>
        <p className="text-xl font-semibold text-gray-800">
          {selectedHairstyle?.name}
        </p>
      </div>
    </div>
  );
};

export default React.memo(ResultsViewer);