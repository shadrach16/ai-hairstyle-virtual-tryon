import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Palette } from 'lucide-react'; // <-- 1. Imported Palette icon
import GoogleSignInButton from '@/components/GoogleSignInButton';

interface ReadyStateProps {
  selectedPhoto: File;
  selectedHairstyle: any;
  isAuthenticated: boolean;
  onClearPhoto: () => void;
}

// --- 2. Sub-component for a modern "glassmorphism" clear button ---
const ClearButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost" // Use ghost for no default bg/border
    size="icon"
    onClick={onClick}
    className="absolute top-3 right-3 w-9 h-9 rounded-full p-0 bg-white/70 backdrop-blur-sm shadow-md text-gray-700 hover:bg-white hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
    aria-label="Clear photo"
  >
    <X className="w-5 h-5" />
  </Button>
);

// --- 3. Sub-component for the "Choose Hairstyle" prompt ---
const ChooseHairstylePrompt = () => (
  <div className="flex items-center space-x-3 p-5 bg-gray-50 rounded-b-xl border-t border-gray-100">
    <div className="flex-shrink-0 p-2 bg-amber-100 rounded-full">
      <Palette className="w-5 h-5 text-amber-600" />
    </div>
    <div>
      <h3 className="text-base font-semibold text-gray-800">
        Choose a Hairstyle
      </h3>
      <p className="text-sm text-gray-500">
        Select a style from the gallery to continue
      </p>
    </div>
  </div>
);

// --- 4. Sub-component for the "Ready to Apply" prompt ---
const ReadyToApplyPrompt = ({
  hairstyleName,
  isAuthenticated,
}: {
  hairstyleName: string;
  isAuthenticated: boolean;
}) => (
  <div className="p-5 bg-gray-50 rounded-b-xl border-t border-gray-100 space-y-4">
    <div className="text-center">
      <p className="text-sm text-gray-500">Ready to apply</p>
      <h3 className="text-xl font-bold text-gray-900">{hairstyleName}</h3>
    </div>

    {!isAuthenticated && (
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-center space-y-3">
        <p className="text-sm font-medium text-amber-800">
          Sign in with Google to generate
        </p>
        <GoogleSignInButton className="bg-amber-600 hover:bg-amber-700 px-8 py-3 w-full" />
      </div>
    )}
  </div>
);

// --- 5. Main Redesigned Component ---
export const ReadyState: React.FC<ReadyStateProps> = ({
  selectedPhoto,
  selectedHairstyle,
  isAuthenticated,
  onClearPhoto,
}) => (
  // Use a clean, contained "card" for a professional look
  <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
    {/* Image Container: Use a predictable aspect ratio */}
    <div className="relative aspect-square w-full">
      <img
        src={URL.createObjectURL(selectedPhoto)}
        alt="Your photo"
        className="w-full h-full object-cover rounded-t-xl" // Match card rounding
      />
      <ClearButton onClick={onClearPhoto} />
    </div>

    {/* Footer Area: This logic is cleaner. 
      It's hidden on mobile (lg:block), assuming the MobileActionBar 
      handles all prompts on small screens.
    */}
    <div className=" ">
      {selectedHairstyle ? (
        <ReadyToApplyPrompt
          hairstyleName={selectedHairstyle.name}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <ChooseHairstylePrompt />
      )}
    </div>
  </div>
);