// src/pages/StudioPage.tsx

import React, { useEffect } from 'react';
import { Loader2, Download, RotateCcw } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
// ✅ UI COMPONENTS
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/AppHeader';
import AfricanHairstyleGrid from '@/components/AfricanHairstyleGrid';
import MobileHairstyleModal from '@/components/MobileHairstyleModal';
import PricingModal from '@/components/PricingModal';
import OnboardingGuide from '@/components/OnboardingGuide';
import HomePage from '@/components/HomePage';

// ✅ NEWLY EXTRACTED COMPONENTS
// (These would be moved to their own files)
import { UploadState } from '@/components/studio/UploadState';
import { ProcessingState } from '@/components/studio/ProcessingState';
import { ReadyState } from '@/components/studio/ReadyState';
import { MobileActionBar } from '@/components/studio/MobileActionBar';
import ResultsViewer from '@/components/ResultsViewer'; // Already external
import { StudioStepper } from '@/components/studio/StudioStepper';
import { useStudioPageLogic } from '@/hooks/useStudioPageLogic';
import AuthModal from '@/components/AuthModal';
 

// --- MAIN COMPONENT ---

export default function StudioPage() {
  // ✅ All logic is now encapsulated in this single hook
  const {
    // State
    studioState,
    uploadMode,
    selectedPhoto,
    selectedHairstyle,
    showPricing,
    downloadLoading,
    showMobileGallery,
    showOnboarding,
    showAuthModal,
    
    // Derived State
    user,
    isAuthenticated,
    hairstyles,
    hairstylesLoading,
    isGenerating,
    generationStatus,
    progress,
    customThumbnailPath,
    customImageFile,

    // Handlers
    handleCloseOnboarding,
    handlePhotoSelect,
    handleClearPhoto,
    handleHairstyleSelect,
    handleMobileHairstyleSelect,
    handleGenerateStyle,
    handleDownload,
    handlePurchase,
    handleTryAnother,
    handleSignOutWithHaptic,
    handleDeleteAccount,
    setShowPricing,
    setShowMobileGallery,
    setShowAuthModal,
handleUploadHairstyle,
    generateCustomHairstyle,
    handleClearCustom
  } = useStudioPageLogic();

  // Page title effect remains here as it's a view concern
  useEffect(() => {
    document.title = 'Hair Studio - AI Hairstyle Try-On';
  }, []);

  // This renders the correct "view" based on the current state
  const renderStudioState = () => {
    switch (studioState) { 
      case 'upload':
        return ( <>

  {!showOnboarding   && (
        <div className="w-full pt-4   sm:px-4 flex justify-center">
          <StudioStepper activeState={studioState} className='w-full' />
        </div>
      )}
          <UploadState
            uploadMode={uploadMode}
            selectedPhoto={selectedPhoto}
            isAuthenticated={isAuthenticated}
            onPhotoSelect={handlePhotoSelect}
            onClearPhoto={handleClearPhoto}
          />
          </>
        );
      case 'processing':
        return (
          selectedPhoto && ( <>

             {!showOnboarding   && (
        <div className="w-full pt-4 px-2 sm:px-4 flex justify-center">
          <StudioStepper activeState={studioState} className='w-full' />
        </div>
      )}
            <ProcessingState
              selectedPhoto={selectedPhoto}
              selectedHairstyle={selectedHairstyle}
              progress={progress}
            />
            </>
          )
        );
      case 'results':
        return (
          <>
            <ResultsViewer
              selectedPhoto={selectedPhoto}
              generationStatus={generationStatus}
              selectedHairstyle={selectedHairstyle}
            />
            {/* Desktop-only action buttons */}
            <div className="hidden sm:block">
              <div className="flex space-x-3">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 h-12 text-base font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={handleTryAnother}
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Try Another
                </Button>
              </div>
            </div>
          </>
        );
      case 'ready':
      default:
        return (
          selectedPhoto && (<>
                  {!showOnboarding   && (
        <div className="w-full pt-4 mb-8 px-2 sm:px-4 flex justify-center">
          <StudioStepper activeState={studioState} className='w-full' />
        </div>
      )}
            <ReadyState
              selectedPhoto={selectedPhoto}
              selectedHairstyle={selectedHairstyle}
              isAuthenticated={isAuthenticated}
              onClearPhoto={handleClearPhoto}
            />
            </>
          )
        );
    }
  };

  return ( studioState === 'home' && !Capacitor.isNativePlatform()  ?<HomePage  />:
    <div className="h-screen bg-[#f9f7f596] flex flex-col overflow-hidden">
      <OnboardingGuide
        isOpen={showOnboarding && Capacitor.isNativePlatform()   }
        onClose={handleCloseOnboarding}
      />

      {Capacitor.isNativePlatform() && !showOnboarding ? (
        <AppHeader
          user={user}
          isAuthenticated={isAuthenticated}
          setShowPricing={setShowPricing}
          handleSignOutWithHaptic={handleSignOutWithHaptic}
          handleDeleteAccount={handleDeleteAccount}
        />
      ): <AppHeader
          user={user}
          isAuthenticated={isAuthenticated}
          setShowPricing={setShowPricing}
          handleSignOutWithHaptic={handleSignOutWithHaptic}
          handleDeleteAccount={handleDeleteAccount}
        /> }

    

<AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={f=>f}
        title="Sign in to Continue"
        description="Sign in to choose any hairstyles"
        showProBenefits={false}
      />


      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-y-hidden">
          <div className={`flex-1 overflow-y-auto ${studioState === 'upload' ? 'px-3' : ''} `}>
            <div className={`flex-1 flex items-start justify-center ${studioState !== 'results' && 'p-1'} sm:p-8 lg:items-center pb-24 lg:pb-4`}>
              <div className="w-full max-w-2xl">
                {renderStudioState()}
                
                {(studioState === 'upload' ) && (
                   <div className="w-full my-4 left-0 p-2 ">
                     <p className="text-center text-xs sm:w-4/5 text-gray-500">
                       Hair Studio can make mistakes, and the output image might not always match the selected hairstyle.
                     </p>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar - Hairstyle Gallery */}
        <div className="hidden lg:block">
          {hairstylesLoading ? (
            <div className="w-70 bg-white border-l border-gray-200 flex items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-amber-600" />
            </div>
          ) : (
            <AfricanHairstyleGrid
              onHairstyleSelect={handleHairstyleSelect}
              selectedHairstyle={selectedHairstyle}
              userCredits={user?.credits || 0}
              hairstyles={hairstyles}
              handleGenerateStyle={handleGenerateStyle}
              setShowPricing={setShowPricing}
              handleUploadHairstyle={handleUploadHairstyle}
            />
          )}
        </div>
      </div>

      {/* Mobile Action Bar */}
      <MobileActionBar
        studioState={studioState}
        selectedHairstyle={selectedHairstyle}
        isGenerating={isGenerating}
        downloadLoading={downloadLoading}
        onDownload={handleDownload}
        onTryAnother={handleTryAnother}
        onGenerate={handleGenerateStyle}
        isAuthenticated={isAuthenticated}
        onShowGallery={() => setShowMobileGallery(true)}
        handleUploadHairstyle={handleUploadHairstyle}
    generateCustomHairstyle={generateCustomHairstyle}
    customThumbnailPath={customThumbnailPath}
    customImageFile={customImageFile}
    handleClearCustom={handleClearCustom}
      />

      {/* Modals */}
      <MobileHairstyleModal
        isOpen={showMobileGallery}
        onClose={() => setShowMobileGallery(false)}
        onHairstyleSelect={handleMobileHairstyleSelect}
        setShowPricing={e=>{
          if (isAuthenticated){
          setShowPricing(e)

        } else {
          setShowAuthModal(true)
        }
        }}
        selectedHairstyle={selectedHairstyle}
        hairstyles={hairstyles}
        userCredits={user?.credits || 0}
      />

      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onPurchase={handlePurchase}
        currentCredits={user?.credits || 0}
        requireAuth={!isAuthenticated}
      />
    </div>
  );
}