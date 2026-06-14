// CustomStyleSheet — bottom sheet for uploading a custom hairstyle reference
// Provides camera + gallery options with a clean, minimal design

import React from 'react';
import { Camera, ImagePlus, X, ImageUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomStyleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}

const OptionButton: React.FC<{
  icon: React.ElementType;
  label: string;
  desc: string;
  onClick: () => void;
}> = ({ icon: Icon, label, desc, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl transition-all',
      'bg-gray-50 ring-1 ring-black/[0.04] active:scale-[0.98] active:bg-gray-100'
    )}
  >
    <div className="w-11 h-11 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div className="flex-1 text-left min-w-0">
      <p className="text-[15px] font-semibold text-gray-900 leading-tight">{label}</p>
      <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
    </div>
  </button>
);

export const CustomStyleSheet: React.FC<CustomStyleSheetProps> = ({
  isOpen,
  onClose,
  onCamera,
  onGallery,
}) => {
  if (!isOpen) return null;

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
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50"
          >
            <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>

              <div className="px-5 pb-[max(24px,calc(16px+var(--safe-area-bottom,0px)))]">
                {/* Header */}
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                      <ImageUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-gray-900 leading-tight">Upload a Hairstyle</h3>
                      <p className="text-[12px] text-gray-400 mt-0.5">We'll match it to your photo using AI</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 -mt-0.5 rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-[13px] text-gray-500 leading-relaxed mb-5 pl-10">
                  Pick any hairstyle photo — from social media, your camera roll, or take a quick snap. Our AI will analyze it and try it on you.
                </p>

                {/* Options */}
                <div className="space-y-2.5">
                  <OptionButton
                    icon={Camera}
                    label="Take a Photo"
                    desc="Snap a hairstyle you like"
                    onClick={onCamera}
                  />
                  <OptionButton
                    icon={ImagePlus}
                    label="Choose from Gallery"
                    desc="Pick from your photo library"
                    onClick={onGallery}
                  />
                </div>

                {/* Cost hint */}
                <p className="text-center text-[11px] text-gray-300 mt-4">
                  Custom styles use 3 credits per generation
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomStyleSheet;
