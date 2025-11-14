// @file: MobileActionBar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Download,
  RotateCcw,
  Palette,
  Upload, X// 👈 New import
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';

// Helper component for iOS safe area
const MobileSafeArea = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  // 'safe-p-b' should be defined in your global CSS to use env(safe-area-inset-bottom)
  return <div className={`pb-0 lg:pb-0 safe-p-b ${className}`}>{children}</div>;
};


type StudioState = 'upload' | 'ready' | 'processing' | 'results';

interface MobileActionBarProps {
  studioState: StudioState;
  selectedHairstyle: any;
  isGenerating: boolean;
  downloadLoading: boolean;
  onDownload: () => void;
  onTryAnother: () => void;
  onGenerate: () => void;
  onShowGallery: () => void; 
  handleUploadHairstyle: () => void; 
  handleClearCustom: () => void; 
  generateCustomHairstyle: () => void; 
  customThumbnailPath: any;
  customImageFile: any;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  studioState,
  selectedHairstyle,
  isGenerating,
  downloadLoading,
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
  const commonWrapperClasses =
    'fixed inset-x-0 bottom-0 lg:hidden bg-white border-t shadow-2xl z-40';

    if ( !Capacitor.isNativePlatform() ){
      return  (
         customThumbnailPath ? <>
            <div className="flex flex-col space-y-2 p-4    ">
              <div className="flex items-center space-x-3 justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={customThumbnailPath}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">
                     Custom Hairstyle
                  </p>
                  <p className="text-xs text-gray-600">
                      3 credits 
                  </p>
                </div>
              </div>

                <Button
    variant="ghost" // Use ghost for no default bg/border
    size="icon"
    onClick={handleClearCustom}
    className=" w-10 h-10 rounded-full p-0 bg-gray-100 backdrop-blur-sm  border text-gray-700 hover:bg-white hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
    aria-label="Clear photo"
  >
    <X className="w-5 h-5" />
  </Button>

              </div>
             

              <div className='flex flex-row space-x-2 '>

                   <Button
                onClick={handleUploadHairstyle}
                variant="outline"
                className="w-1/3 h-12 text-base font-semibold   flex items-center justify-center"
              >
                <Upload className="w-5 h-5" />
              Change Hairstyle

              </Button>

                <Button
                  onClick={()=>generateCustomHairstyle(customImageFile,customThumbnailPath)}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-base h-12 px-6 font-semibold w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Generate Hairstyle'
                  )}
                </Button>
            </div>
            </div></>: <></>)
    }

  // --- State: 'upload' ---
  if (studioState === 'upload') {
    return (
      <MobileSafeArea className={commonWrapperClasses}>
        <div className="p-3">
          {/* 👈 UPDATED: Two buttons for 'upload' state */}
          <div className="flex space-x-2">
            <Button disabled
              onClick={onShowGallery} // Original button: Choose Style
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 h-12 text-base font-semibold shadow-lg">
              <Palette className="w-5 h-5 mr-2" />
              Choose Hairstyle
            </Button>
            <Button
              onClick={handleUploadHairstyle} // New button: Upload Style
              variant="outline" disabled
              className=" h-12 text-base font-semibold border border-gray-300  flex items-center justify-center"
            >
              <Upload className="w-5 h-5   font-bold" />
              Upload Hairstyle

            </Button>
          </div>
        </div>
      </MobileSafeArea>
    );
  }

  if (studioState === 'results') {
    return (
      <MobileSafeArea className={commonWrapperClasses}>
        <div className="p-3">
          <div className="flex space-x-3">
            <Button
              onClick={onDownload}
              className="flex-1 bg-amber-600 hover:bg-amber-700 h-12 text-base font-semibold"
              disabled={downloadLoading}
            >
              {downloadLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </>
              )}
            </Button>
            <Button
              onClick={onTryAnother}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Another
            </Button>
          </div>
        </div>
      </MobileSafeArea>
    );
  }


  if (studioState === 'ready') {
    return (
      <MobileSafeArea className={commonWrapperClasses}>
        <div className="p-3">
          {selectedHairstyle ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedHairstyle.thumbnail}
                  alt={selectedHairstyle.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold text-sm truncate w-[80%]">
                    {selectedHairstyle.name === 'Custom Upload' ? 'Your Uploaded Style' : selectedHairstyle.name}
                  </p>
                  <p className="text-xs text-gray-600">
                      {/* Check the custom price of 3 credits */}
                    {selectedHairstyle.id === 'user-upload-custom-style' ? '3 credits' : `${selectedHairstyle.price} credits`}
                  </p>
                </div>
              </div>
              {/* 👈 UPDATED: Three buttons for 'ready' state when style is selected */}
              <div className="flex space-x-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowGallery}
                  className="text-sm h-10 px-4 w-[25%]" 
                >
                  <Palette className="w-4 h-4" /> Change
                </Button>
       
                <Button
                  onClick={onGenerate}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-sm h-10 px-6 font-semibold w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Generate HairStyle'
                  )}
                </Button>
              </div>
            </div>
          )  :  customThumbnailPath ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3 justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={customThumbnailPath}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">
                     Custom Hairstyle
                  </p>
                  <p className="text-xs text-gray-600">
                      3 credits 
                  </p>
                </div>
              </div>

                <Button
    variant="ghost" // Use ghost for no default bg/border
    size="icon"
    onClick={handleClearCustom}
    className=" w-9 h-9 rounded-full p-0 bg-gray-100 backdrop-blur-sm  border text-gray-700 hover:bg-white hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
    aria-label="Clear photo"
  >
    <X className="w-5 h-5" />
  </Button>

              </div>
             

              <div className='flex flex-row space-x-2 '>

                   <Button
                onClick={handleUploadHairstyle}
                variant="outline"
                className="w-1/3 h-10 text-base font-semibold   flex items-center justify-center"
              >
                <Upload className="w-5 h-5" />
              Change

              </Button>

                <Button
                  onClick={()=>generateCustomHairstyle(customImageFile,customThumbnailPath)}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-sm h-10 px-6 font-semibold w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Generate Hairstyle'
                  )}
                </Button>
            </div>
            </div>
          ): (
     
            <div className="flex space-x-2">
              <Button
                onClick={onShowGallery}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 h-12 text-base font-semibold shadow-lg">
                <Palette className="w-5 h-5 mr-2" />
                Choose Hairstyle
              </Button>
              <Button
                onClick={handleUploadHairstyle}
                variant="outline"
                className=" h-12 text-base font-semibold   flex items-center justify-center"
              >
                <Upload className="w-5 h-5" />
              Upload Hairstyle

              </Button>
            </div>
          )}
        </div>
      </MobileSafeArea>
    );
  }

  // Do not render anything for 'processing' state
  return null;
};