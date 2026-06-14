import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SwitchCamera, Camera } from 'lucide-react';

interface CameraCaptureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File, dataUrl: string) => void;
}

export const CameraCaptureOverlay: React.FC<CameraCaptureOverlayProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const startCamera = useCallback(async (facing: 'user' | 'environment') => {
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setReady(false);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setReady(true);
      }
    } catch {
      setError('Camera access denied. Please allow camera permissions and try again.');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, facingMode, startCamera]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'camera_hairstyle.jpg', { type: 'image/jpeg' });
          onCapture(file, dataUrl);
        }
      },
      'image/jpeg',
      0.92,
    );
  }, [onCapture]);

  const toggleFacing = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex flex-col bg-black"
        >
          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),16px)] pb-3">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <p className="text-sm font-semibold text-white/90 drop-shadow-sm">
              Snap a Hairstyle
            </p>
            <button
              onClick={toggleFacing}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
            >
              <SwitchCamera className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Video feed */}
          <div className="flex-1 relative overflow-hidden">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full px-8 text-center">
                <Camera className="w-12 h-12 text-white/30 mb-4" />
                <p className="text-sm text-white/70 leading-relaxed">{error}</p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-full bg-white/10 text-white text-sm font-semibold active:scale-95 transition-transform"
                >
                  Go Back
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Bottom controls */}
          {!error && (
            <div className="absolute bottom-0 inset-x-0 z-10 flex items-center justify-center pb-[max(env(safe-area-inset-bottom),24px)] pt-5 bg-gradient-to-t from-black/60 to-transparent">
              <button
                onClick={handleCapture}
                disabled={!ready}
                className="w-[72px] h-[72px] rounded-full border-[4px] border-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
              >
                <div className="w-[58px] h-[58px] rounded-full bg-white" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
