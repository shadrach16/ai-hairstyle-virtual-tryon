// src/hooks/useStudioPageLogic.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

// ✅ CAPACITOR IMPORTS
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Dialog } from '@capacitor/dialog';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // 👈 NEW IMPORT

// ✅ HOOKS & LIB
import { useAuth } from '@/hooks/useAuth';
import { useHairstyles } from '@/hooks/useHairstyles';
import { useGeneration } from '@/hooks/useGeneration';
import { handleSignOut, requiresUpgrade } from '@/lib/auth';
// Assuming apiService, Hairstyle interface, and analyzeHairstyleImage function are imported from here
import { apiService } from '@/lib/api'; 
import { type CreditPack, type SubscriptionPlan } from '@/lib/pricingSystem';

// --- NEW CONSTANT: Custom Hairstyle Placeholder ---
// This object represents the user's uploaded style in the UI/state.
const CUSTOM_HAIRSTYLE_PLACEHOLDER: any = { // Using 'any' to avoid circular dependency with Hairstyle type
  id: 'user-upload-custom-style', // Unique ID to denote a custom style
  name: 'Custom Upload',
  description: 'AI-analyzed custom style from user image.',
  ai_description: '', // Populated after analysis
  category: 'Custom',
  gender: 'unisex',
  // Placeholder thumbnail that will be replaced by the uploaded image's URI/DataURL
  thumbnail: 'https://via.placeholder.com/100/A0A0A0/FFFFFF?text=Custom', 
  price: 3, // 👈 3 credits deduction for the custom style
  tags: ['custom', 'uploaded'],
  popularity: 0,
  estimatedTime: '60s',
  maintenance: 'medium',
  difficulty: 'medium',
  isActive: true,
};


// --- Extracted Utilities (These should be in lib/native-utils.ts) ---

const triggerHapticFeedback = (style: ImpactStyle) => {
  // Implementation omitted for brevity
};

const checkAndRequestStoragePermission = async (): Promise<boolean> => {
  if (Capacitor.getPlatform() !== 'android') return true;
  try {
    let status = await Filesystem.checkPermissions();
    if (status.publicStorage !== 'granted') {
      status = await Filesystem.requestPermissions();
      return status.publicStorage === 'granted';
    }
    return true;
  } catch (e) {
    console.error('Storage permission error:', e);
    return false;
  }
};

const registerForPushNotifications = async (navigate: (path: string) => void) => {
  try {
    const permStatus = await PushNotifications.requestPermissions();
    if (permStatus.receive !== 'granted') {
      console.warn('Push notification permission denied');
      return;
    }
    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token: Token) => {
      try {
        await apiService.updateDeviceToken({ deviceToken: token.value });
      } catch (error) {
        console.error('Failed to send device token:', error);
      }
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      toast.info(notification.title || 'Notification', {
        description: notification.body,
        duration: 5000,
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      const link = action.notification.data?.link;
      if (link) navigate(link);
    });
  } catch (error) {
    console.error('Push notification setup error:', error);
  }
};

// --- TYPES ---
export type StudioState = 'home' |'upload' | 'ready' | 'processing' | 'results';
export type UploadMode = 'camera' | 'library';

const ONBOARDING_KEY = 'hasViewedOnboardingCheck3';

// --- THE CORE LOGIC HOOK ---

export const useStudioPageLogic = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [studioState, setStudioState] = useState<StudioState>('home');
  const [uploadMode, setUploadMode] = useState<UploadMode>('camera');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState<any>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showMobileGallery, setShowMobileGallery] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [customThumbnailPath, setCustomThumbnailPath] = useState();
  const [customImageFile, setCustomImageFile] = useState();

  // Hooks
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { hairstyles, isLoading: hairstylesLoading } = useHairstyles();
  // Assuming useGeneration.generateHairstyle now handles the custom AI description logic
  const { isGenerating, generationStatus, progress, generateHairstyle, resetGeneration,handleCustomGenerator } = useGeneration();

  const isNative = useMemo(() => Capacitor.isNativePlatform(), []);
  const isMobile = useMemo(() => window.innerWidth < 1024, []);

  // Onboarding Effect
  useEffect(() => {
    const hasViewed = localStorage.getItem(ONBOARDING_KEY);
    if (!hasViewed) {
      setShowOnboarding(true);
    }
  }, []);

  // Push Notifications Effect
  useEffect(() => {
    if (user?.id && isNative) {
      registerForPushNotifications(navigate);
    }
    if (!user?.id) {
      refreshUser();
    }
  }, [user?.id, navigate, refreshUser, isNative]);

  // URL Sync Effect
  useEffect(() => {
    const status = searchParams.get('studio_status');
    const mode = searchParams.get('mode') as UploadMode;
    
    if (status && ['upload', 'ready', 'processing', 'results'].includes(status)) {
      setStudioState(status as StudioState);
    } else {
      setStudioState('home');
      if (isNative) {
        navigate('/?studio_status=upload&mode=camera', { replace: true });
      }
    }

    if (mode && ['camera', 'library'].includes(mode)) {
      setUploadMode(mode);
    }
  }, [searchParams, navigate, isNative]);

  // Event Tracking & State Guard Effect
  useEffect(() => {
    if (user?.id) {
      apiService.trackEvent('page_view', { page: studioState, userId: user.id });
    }
    if (studioState === 'ready' && !selectedPhoto) {
      navigate('/?studio_status=upload&mode=camera', { replace: true });
    }
  }, [studioState, user?.id, selectedPhoto, navigate]);

  // Generation Status Effect
  useEffect(() => {
    if (generationStatus?.status === 'completed' && generationStatus.generatedImageUrl) {
      navigate('/?studio_status=results', { replace: true });
    } else if (generationStatus?.status === 'failed') {
      navigate('/?studio_status=ready', { replace: true });
    }
  }, [generationStatus, navigate]);

  // --- Event Handlers ---

  const handleCloseOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, 'true');
  }, []);


const handleClearCustom =  useCallback(() => {
   setCustomThumbnailPath()
   customImageFile()
  }, []);

 

  const handlePhotoSelect = useCallback((file: File, mimeType: string) => {
    setSelectedPhoto(file);
    setImageMimeType(mimeType);
    navigate('/?studio_status=ready');
    if (user?.id) {
      apiService.trackEvent('photo_uploaded', {
        userId: user.id,
        fileSize: file.size,
        fileType: file.type,
      });
    }
  }, [navigate, user?.id]);

  const handleClearPhoto = useCallback(() => {
    setSelectedPhoto(null);
    setImageMimeType(null);
    setSelectedHairstyle(null);
    resetGeneration();
    setShowMobileGallery(false);
    navigate('/?studio_status=upload&mode=camera');
    setCustomImageFile()
    setCustomThumbnailPath()
  }, [navigate, resetGeneration]);

  const handleHairstyleSelect = useCallback((hairstyle: any) => {
    setSelectedHairstyle(hairstyle);
    triggerHapticFeedback(ImpactStyle.Light);
    if (user?.id) {
      apiService.trackEvent('hairstyle_selected', {
        userId: user.id,
        hairstyleId: hairstyle._id,
        hairstyleName: hairstyle.name,
      });
    }
  }, [user?.id]);

  const handleMobileHairstyleSelect = useCallback((hairstyle: any) => {
    setSelectedHairstyle(hairstyle);
    setShowMobileGallery(false);
    triggerHapticFeedback(ImpactStyle.Light);
  }, []);
  



  const handleUploadHairstyle = useCallback(async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.info('Please sign in to upload a custom hairstyle.');
      return;
    }

    if (!selectedPhoto) {
      toast.error('Please upload your photo first before selecting a custom hairstyle.');
      return;
    }

setSelectedHairstyle()
    

    try {
      // 1. Open Image Picker (Capacitor/Web)
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        source: CameraSource.Photos, 
        resultType: Capacitor.isNativePlatform() ? CameraResultType.Uri : CameraResultType.DataUrl, 
      });

      if (!image.webPath && !image.dataUrl) {
        toast.info('Hairstyle selection cancelled.');
        return;
      }
      
      let imageFile: File;
      let thumbnailPath: string;

      if (Capacitor.isNativePlatform() && image.webPath) {
        // Convert webPath to File object for FormData upload
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        imageFile = new File([blob], 'uploaded_hairstyle.jpg', { type: blob.type || 'image/jpeg' });
        thumbnailPath = image.webPath;
      } else if (image.dataUrl) {
        // Convert DataUrl for web to blob/File
        const dataUrl = image.dataUrl;
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        imageFile = new File([u8arr], 'uploaded_hairstyle.jpg', {type: mime});
        thumbnailPath = image.dataUrl;
      } else {
        toast.error('Could not process the selected image.');
        return;
      }

      setCustomThumbnailPath(thumbnailPath)
      setCustomImageFile(imageFile)

        } catch (e) {
      console.error('Hairstyle upload failed:', e);
      toast.error('Failed to upload and analyze image.');
      setStudioState('ready'); 
    }
  }, [isAuthenticated, user, setShowAuthModal, setShowPricing, selectedPhoto, navigate, refreshUser]);




  const generateCustomHairstyle = useCallback(async (imageFile: File,thumbnailPath:any) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.info('Please sign in to upload a custom hairstyle.');
      return;
    }

    if (!selectedPhoto) {
      toast.error('Please upload your photo first before selecting a custom hairstyle.');
      return;
    }

 if (requiresUpgrade(user, 3)) {
      setShowPricing(true);
      return;
    }
  navigate('/?studio_status=processing');
    

    try {

      const result = await handleCustomGenerator(imageFile,imageMimeType,selectedPhoto );
      
       if (result.success) {
        refreshUser();
      } else {
        toast.error(result.message || 'Generation failed');
        refreshUser();
        navigate('/?studio_status=ready');
      }


        } catch (error) {
          console.log(error)
     toast.error(error.message || 'Something went wrong. Please try again.');
      navigate('/?studio_status=ready');
    }
  }, [isAuthenticated, user, setShowAuthModal, setShowPricing, selectedPhoto, navigate, refreshUser]);




   

  const handleGenerateStyle = useCallback(async () => {
    if (!selectedPhoto || !selectedHairstyle) {
      if (isMobile && !selectedHairstyle) {
        setShowMobileGallery(true);
      }
      return;
    }
    
    // --- Determine Credits and Generation Type ---
    const isCustomStyle = selectedHairstyle.id === CUSTOM_HAIRSTYLE_PLACEHOLDER.id;
    const requiredCredits = selectedHairstyle.price || 1; 

    if (!isAuthenticated) {
      toast.info('Sign in to generate hairstyles', {
        description: 'Get 5 free credits when you sign up!',
      });
      return;
    }
    if (requiresUpgrade(user, requiredCredits)) {
      setShowPricing(true);
      return;
    }
    navigate('/?studio_status=processing');
    
    try {
        let result;
        
        if (isCustomStyle) {
            // New signature for custom styles: passing description and credits
            // The useGeneration hook's `generateHairstyle` function must be updated to handle this
            result = await generateHairstyle(
                { customAiDescription: selectedHairstyle.ai_description, creditsUsed: requiredCredits },
                imageMimeType,
                selectedPhoto
            );
            apiService.trackEvent('generation_started_custom', { userId: user.id, creditsUsed: requiredCredits });
        } else {
            // Original signature for standard styles: passing hairstyle ID
            result = await generateHairstyle(selectedHairstyle._id, imageMimeType, selectedPhoto);
            apiService.trackEvent('generation_started_standard', { userId: user.id, hairstyleId: selectedHairstyle._id });
        }

      if (result.success) {
        refreshUser();
      } else {
        toast.error(result.message || 'Generation failed');
        refreshUser();
        navigate('/?studio_status=ready');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
      navigate('/?studio_status=ready');
    }
  }, [selectedPhoto, selectedHairstyle, isAuthenticated, user, navigate, generateHairstyle, imageMimeType, refreshUser, isMobile]);


  const handleDownload = useCallback(async () => {
    if (!generationStatus?.generatedImageUrl) return;
    setDownloadLoading(true);
    triggerHapticFeedback(ImpactStyle.Light);
    if (isNative) {
      const hasPermission = await checkAndRequestStoragePermission();
      if (!hasPermission) {
        toast.error('Permission denied. Cannot save file.');
        setDownloadLoading(false);
        return;
      }
      const fileName = `hair-studio-${selectedHairstyle?.name}-${Date.now()}.jpg`.replaceAll(' ', '_');
      try {
        await Filesystem.downloadFile({
          path: fileName,
          url: generationStatus.generatedImageUrl,
          directory: Directory.Documents,
          recursive: true,
        });
        toast.success(`Image saved to Downloads! 📸`);
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to save image.');
      }
    } else {
      const link = document.createElement('a');
      link.href = generationStatus.generatedImageUrl;
      link.download = `hair-studio-${selectedHairstyle?.name}-${Date.now()}.jpg`.replaceAll(' ', '_');
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully! 📸');
    }
    setDownloadLoading(false);
  }, [generationStatus, selectedHairstyle, isNative]);

  const handlePurchase = useCallback(async (item: CreditPack | SubscriptionPlan) => {
    if (!isAuthenticated) {
      toast.info('Please sign in first to purchase credits');
      return false;
    }
    // Purchase logic here
    const success = true; // Placeholder
    if (success) {
      setShowPricing(false);
      refreshUser();
      if (selectedPhoto && selectedHairstyle) {
        setTimeout(() => {
          handleGenerateStyle();
        }, 1000);
      }
    }
    return success;
  }, [isAuthenticated, refreshUser, selectedPhoto, selectedHairstyle, handleGenerateStyle]);

  const handleTryAnother = useCallback(() => {
    setSelectedHairstyle(null);
    resetGeneration();
    navigate('/?studio_status=ready');
    
  }, [navigate, resetGeneration, isMobile]);

  const handleSignOutWithHaptic = useCallback(async () => {
    triggerHapticFeedback(ImpactStyle.Medium);
    await handleSignOut();
    navigate('/?studio_status=upload&mode=camera', { replace: true });
  }, [navigate]);

  const handleDeleteAccount = useCallback(async () => {
    triggerHapticFeedback(ImpactStyle.Heavy);
    const result = await Dialog.confirm({
      title: 'Delete Account',
      message: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
      okButtonTitle: 'Yes, Delete',
      cancelButtonTitle: 'Cancel',
    });
    if (!result.value) {
      triggerHapticFeedback(ImpactStyle.Light);
      toast.info('Account deletion cancelled.');
      return;
    }
    try {
      if (!user?.id) {
        toast.error('Authentication error. Please sign in again.');
        return;
      }
      const response = await apiService.deleteAccount();
      if (response.status === 'success') {
        toast.success(response.message || 'Account successfully deleted.');
        await handleSignOut();
        navigate('/?studio_status=upload&mode=camera', { replace: true });
      } else {
        toast.error(response.message || 'Failed to delete account.');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Network error. Failed to connect to the server.');
    }
  }, [user?.id, navigate]);

  // Return all state and handlers
  return {
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
    handleClearCustom,
    generateCustomHairstyle
  };
};