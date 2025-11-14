import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ProcessingStateProps {
  selectedPhoto: File;
  selectedHairstyle: { name: string; id: string } | null; // More specific type
  progress: number; // Expected to be 0-100 from useGeneration.ts
  onComplete?: () => void; // Optional callback when processing and countdown are done
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  selectedPhoto,
  selectedHairstyle,
  progress,
  onComplete,
}) => {
  // FIXED: progress is already 0-100. We just cap it at 99 for the visual progress bar.
  const visualProgressPercent = Math.min(progress, 99);

  console.log('Current Progress:', progress); // For debugging
  console.log('Visual Progress:', visualProgressPercent); // For debugging

  // Countdown state, initialized to 12 seconds
  const [countdown, setCountdown] = useState(12);
  const [processingComplete, setProcessingComplete] = useState(false);

  // Effect to handle the progress bar reaching 99% (Transition to Countdown)
  // FIXED: Trigger condition changed from 0.99 (decimal) to 99 (integer)
  useEffect(() => {
    if (progress >= 99 && !processingComplete) { 
      setProcessingComplete(true);
    }
  }, [progress, processingComplete]);


  // Effect for the countdown timer
  useEffect(() => {
    if (processingComplete && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000); // Decrement every second
      return () => clearTimeout(timer); // Clean up timeout
    } else if (processingComplete && countdown === 0) {
      // Both processing and countdown are done
      if (onComplete) {
        onComplete();
      }
    }
  }, [processingComplete, countdown, onComplete]);


  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg text-center max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 animate-fade-in">
        Applying Hairstyle
      </h2>

      {/* Image and Sparkle Overlay */}
      <div className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto mb-8 animate-scale-in">
        <img
          src={URL.createObjectURL(selectedPhoto)}
          alt="Your original photo"
          className="w-full h-full object-cover rounded-full border-4 border-amber-300 shadow-md"
        />
        <div className="absolute inset-0   rounded-full flex items-center justify-center animate-pulse-light">
          <Sparkles className="w-4 h-4 text-white drop-shadow-lg" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4 animate-slide-up truncate">
        Applying <span className="text-amber-600">{selectedHairstyle?.name?.slice(0,10) || 'style'}</span>...
      </h3>

      {/* Progress Bar with Percentage */}
      <div className="w-full max-w-sm mx-auto mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${visualProgressPercent}%` }}
            role="progressbar"
            aria-valuenow={visualProgressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-sm font-medium text-gray-600 mt-2">
          {String(visualProgressPercent).slice(0,2)}% Complete
        </p>
      </div>

    

      {/* Optional: Add some subtle animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-light {
          0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); }
          100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out 0.2s forwards; }
        .animate-pulse-light { animation: pulse-light 2s infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out 0.4s forwards; }
      `}</style>
    </div>
  );
};