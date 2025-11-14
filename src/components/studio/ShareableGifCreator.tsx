import React, { useState, useEffect, useRef, useCallback } from 'react';
import gifshot from 'gifshot';
import { Capacitor } from '@capacitor/core';
import { Share, ShareOptions } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Share2, AlertCircle, Sparkles, Film, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShareableGifCreatorProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  gifWidth?: number;
  gifHeight?: number;
  interval?: number;
  frameDuration?: number;
  referralLink?: string;
  appName?: string;
}

type GifStatus = 'idle' | 'generating' | 'finished' | 'error';

export function ShareableGifCreator({
  beforeImageUrl,
  afterImageUrl,
  gifWidth = 800,
  gifHeight = 800,
  interval = 0.8,
  frameDuration = 4,
  referralLink = '',
  appName = 'Hair Studio',
}: ShareableGifCreatorProps) {
  const [status, setStatus] = useState<GifStatus>('idle');
  const [gifDataUrl, setGifDataUrl] = useState<string | null>(null);
  const gifGenerated = useRef(false);
  const [caption, setCaption] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const getDefaultCaption = useCallback(() => {
    const linkText = referralLink ? `\n\nTry it yourself & get FREE credits: ${referralLink}` : '';
    const appTag = `#${appName.replace(/\s+/g, '')}`;
    return `Before vs. After! 💇✨\n#HairTransformation #AIStyle ${appTag}${linkText}`;
  }, [appName, referralLink]);

  useEffect(() => {
    setCaption(getDefaultCaption());
  }, [getDefaultCaption]);

  const generateGif = useCallback(() => {
    if (status === 'generating') return;

    setStatus('generating');
    setGifDataUrl(null);
    gifGenerated.current = true;
    console.log('🎬 Starting GIF generation...');
    const generationStartTime = Date.now();

    gifshot.createGIF({
      images: [beforeImageUrl, afterImageUrl],
      gifWidth: gifWidth,
      gifHeight: gifHeight,
      interval: interval,
      numFrames: 18,
      frameDuration: frameDuration,
      crossOrigin: 'Anonymous',
      sampleInterval: 10,
      numWorkers: 2,
      fontWeight: 'bold',
      fontSize: '16px',
      fontFamily: 'sans-serif',
      fontColor: '#ffffff',
      textAlign: 'center',
      textBaseline: 'bottom',
      text: `${appName}`,
      filter: 'contrast(1.1)',
    }, (obj) => {
      const duration = Date.now() - generationStartTime;
      if (!obj.error) {
        const image = obj.image;
        console.log(`✅ GIF generation successful! Took ${duration}ms`);
        setGifDataUrl(image);
        setStatus('finished');
        toast.success("GIF ready to share!");
      } else {
        console.error(`❌ GIF generation failed after ${duration}ms:`, obj.error);
        setStatus('error');
        toast.error("Failed to create GIF", { description: obj.errorMsg || 'Please try again.' });
        gifGenerated.current = false;
      }
    });
  }, [status, beforeImageUrl, afterImageUrl, gifWidth, gifHeight, interval, frameDuration, appName]);

  useEffect(() => {
    if (isInView && !gifGenerated.current && status === 'idle') {
      console.log('[ShareableGifCreator] Component in view, starting GIF generation...');
      generateGif();
    }
  }, [isInView, status, generateGif]);

  // FIXED: Share the actual GIF IMAGE FILE, not a URL link
  const handleShare = useCallback(async () => {
    if (!gifDataUrl || status !== 'finished') {
      toast.error("GIF not ready to share yet.");
      return;
    }

    console.log('🚀 Starting share process...');
    const toastId = toast.loading("Preparing GIF for sharing...");

    try {
      // === NATIVE PLATFORM (iOS/Android) ===
      if (Capacitor.isNativePlatform()) {
        console.log('📱 Native platform detected');

        // Extract base64 data from data URL
        const base64Data = gifDataUrl.split(',')[1];
        if (!base64Data) {
          throw new Error("Invalid GIF data URL.");
        }

        const fileName = `hairstudio_transformation_${Date.now()}.gif`;
        console.log(`📁 Saving GIF as: ${fileName}`);

        // 1. Write the GIF file to Cache directory
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache,
        });
        console.log('✅ GIF saved to cache directory');

        // 2. Get the native file URI
        const { uri: nativeFileUri } = await Filesystem.getUri({
          directory: Directory.Cache,
          path: fileName
        });
        console.log(`📍 Native file URI: ${nativeFileUri}`);

        toast.dismiss(toastId);

        // 3. Share the actual GIF FILE (not a URL link)
        const shareOptions: ShareOptions = {
          title: `My ${appName} Hairstyle Transformation!`,
          text: caption,
          dialogTitle: `Share Your ${appName} GIF`,
          files: [nativeFileUri], // ✅ Shares the actual GIF image file
        };

        console.log('📤 Sharing GIF file...');
        await Share.share(shareOptions);
        console.log('✅ Share completed successfully');

        // 4. Clean up temporary file after a delay
        setTimeout(async () => {
          try {
            await Filesystem.deleteFile({
              path: fileName,
              directory: Directory.Cache,
            });
            console.log('🗑️ Temporary GIF file deleted');
          } catch (deleteError) {
            console.warn('⚠️ Could not delete temporary file:', deleteError);
          }
        }, 2000);

        return;
      }

      // === WEB PLATFORM ===
      console.log('🌐 Web platform detected');

      // Try Web Share API with file support
      if (navigator.share && navigator.canShare) {
        // Convert data URL to Blob
        const response = await fetch(gifDataUrl);
        const blob = await response.blob();
        const file = new File([blob], `${appName.replace(/\s+/g, '_')}_transformation_${Date.now()}.gif`, { 
          type: 'image/gif' 
        });

        // Check if browser supports sharing files
        if (navigator.canShare({ files: [file] })) {
          toast.dismiss(toastId);
          console.log('📤 Sharing via Web Share API with file');
          await navigator.share({
            title: `My ${appName} Transformation!`,
            text: caption,
            files: [file], // ✅ Share the actual GIF file
          });
          console.log('✅ Web share completed');
          return;
        }
      }

      // Fallback: Download the GIF
      console.log('📥 Falling back to download');
      toast.dismiss(toastId);

      const link = document.createElement('a');
      link.href = gifDataUrl;
      link.download = `${appName.replace(/\s+/g, '_')}_transformation_${Date.now()}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Try to copy caption to clipboard
      try {
        await navigator.clipboard.writeText(caption);
        toast.success('GIF downloaded! Caption copied to clipboard.');
      } catch {
        toast.success('GIF downloaded!');
      }

    } catch (error: any) {
      toast.dismiss(toastId);

      // Handle user cancellation gracefully
      if (error.name === 'AbortError' || 
          error.message?.toLowerCase().includes('cancel') ||
          error.message?.toLowerCase().includes('abort')) {
        console.log('❌ Share cancelled by user');
        toast.info('Share cancelled');
        return;
      }

      console.error('❌ Share error:', error);
      toast.error('Could not share GIF', { 
        description: error.message || 'Please try again' 
      });
    }
  }, [gifDataUrl, status, caption, appName]);

  // Optional: Direct download function
  const handleDownload = useCallback(() => {
    if (!gifDataUrl) return;

    const link = document.createElement('a');
    link.href = gifDataUrl;
    link.download = `${appName.replace(/\s+/g, '_')}_transformation_${Date.now()}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('GIF downloaded!');
  }, [gifDataUrl, appName]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-4 p-4 w-full mx-auto">
      {/* Generated GIF Display Area */}
      <div className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center overflow-hidden relative group">
        {/* Loading State */}
        {status === 'generating' && (
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-white p-4'>
            <Loader2 className="w-10 h-10 animate-spin text-white" />
            <p className='mt-3 text-sm font-medium text-center'>Creating your animated GIF...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className='absolute inset-0 bg-red-100 flex flex-col items-center justify-center z-10 text-red-700 p-4'>
            <AlertCircle className="w-10 h-10" />
            <p className='mt-2 text-sm font-medium text-center'>Couldn't create GIF.<br/>Please try again.</p>
            <Button variant="destructive" size="sm" onClick={generateGif} className="mt-4">
              <Film className="w-4 h-4 mr-2" /> Retry GIF
            </Button>
          </div>
        )}

        {/* GIF Display */}
        {gifDataUrl && (
          <img
            src={gifDataUrl}
            alt="Before and After AI Hairstyle GIF"
            key={beforeImageUrl + afterImageUrl}
            className={cn(
              "w-full h-full object-contain transition-opacity duration-500",
              status === 'finished' ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {/* Idle Placeholder */}
        {status === 'idle' && !gifDataUrl && (
          <div className='text-slate-400 flex flex-col items-center p-4 text-center'>
            <Sparkles className="w-12 h-12 mb-2 opacity-50"/>
            <span className="text-sm font-medium">Your Before & After<br/>GIF will appear here</span>
          </div>
        )}
      </div>

      {/* Editable Caption */}
      {status === 'finished' && gifDataUrl && (
        <div className="w-full mt-2">
          <label htmlFor="share-caption" className="text-xs font-medium text-gray-600 mb-1 block">
            Edit caption & share:
          </label>
          <Textarea
            id="share-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            className="w-full text-sm border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 resize-none"
            placeholder="Write your caption..."
          />
        </div>
      )}

      {/* Action Buttons */}
      {status === 'finished' && gifDataUrl && (
        <div className="w-full flex gap-2">
          <Button
            onClick={handleShare}
            size="lg"
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Share2 className="w-5 h-5 mr-2" /> Share GIF
          </Button>

          {/* Download button (visible on all platforms) */}
          <Button
            onClick={handleDownload}
            size="lg"
            variant="outline"
            className="flex-shrink-0 hover:bg-slate-50"
            title="Download GIF"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Status Messages */}
      {status === 'generating' && (
        <div className="flex items-center justify-center text-sm text-slate-500 animate-pulse h-10">
          <Loader2 className="w-4 h-4 mr-2 animate-spin"/> Generating GIF...
        </div>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-500 font-medium h-10 flex items-center justify-center">
          GIF creation failed.
        </p>
      )}

      {status === 'idle' && !gifGenerated.current && (
        <p className="text-sm text-slate-400 h-10 flex items-center justify-center">
          GIF will generate automatically...
        </p>
      )}
    </div>
  );
}