import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PaywallScreen } from '@/components/PaywallScreen';
import { WebPaywallScreen } from '@/components/WebPaywallScreen';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Crown, Coins, Loader2, X, Check, Tv, Zap, Sparkles, Shield, Gift, Share2, Copy, Users } from 'lucide-react';
import { apiService } from '@/lib/api'; 
import AuthModal from './AuthModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePayment } from '@/hooks/usePayment';
import { cn } from '@/lib/utils';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AdService } from '@/lib/adService'; 
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

// Capacitor Haptics Utility
const triggerHapticFeedback = async (style: ImpactStyle) => {
  
};

// --- Ad Watch Component (Mobile Optimized) ---
interface AdCreditTabProps {
  refreshUser: () => void;
  isAuthenticated: boolean;
  handleAuthClick: () => void;
}

const AdCreditTab = ({ refreshUser, isAuthenticated, handleAuthClick }: AdCreditTabProps) => {
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [isNativeAvailable, setIsNativeAvailable] = useState(AdService.isNative());

  React.useEffect(() => {
    setIsNativeAvailable(AdService.isNative());
  }, []);

  const handleWatchAd = useCallback(async () => {
    if (!isAuthenticated) {
      handleAuthClick();
      return;
    }

    if (!isNativeAvailable) {
      toast.error("Ad service unavailable", {
        description: "Free credits via ads are only supported on the native mobile app."
      });
      return;
    }

    await triggerHapticFeedback('medium');
    setIsAdLoading(true);

    try {
      const result = await AdService.showRewardedAd(true);

      if (result.success && result.completed) {
        await apiService.grantFreeCredit(); 
        await refreshUser();
        toast.success('🎉 0.5 Credit Added!', {
          description: 'Thank you for supporting us by watching the ad.',
        });
      } else {
        toast.info(result.completed === false ? 'Ad skipped or closed early. No credit granted.' : 'Ad failed to load. Try again later.');
      }
    } catch (error) {
      console.error('Ad watching error:', error);
      toast.error('An error occurred loading the ad. Please try again.');
    } finally {
      setIsAdLoading(false);
      await triggerHapticFeedback('light');
    }
  }, [isAuthenticated, isNativeAvailable, refreshUser, handleAuthClick]);

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:py-8 sm:px-8 space-y-6 sm:space-y-8">
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Get Free Credits
        </h3>
        <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Watch a short video ad and instantly receive <span className="font-bold text-purple-700">0.5 free credit</span> to use on your next generation.
        </p>
      </div>

      <Card className="w-full max-w-md bg-gradient-to-br from-amber-50 to-emerald-50 border-2 border-amber-200/50 overflow-hidden">
        <CardContent className="p-6 sm:p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center space-x-3 bg-white rounded-full px-6 py-3 shadow-md">
            <Coins className="w-7 h-7 text-amber-600" />
            <span className="text-xl font-extrabold bg-gradient-to-r from-amber-600 to-emerald-600 bg-clip-text text-transparent">
              +0.5 CREDIT
            </span>
          </div>
        </CardContent>
      </Card>

      {!isAuthenticated && (
        <div className="w-full max-w-md space-y-3 sm:space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm sm:text-base text-blue-800 font-medium">
              Sign in to unlock free credits
            </p>
          </div>
          <Button 
            onClick={handleAuthClick} 
            className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Sign In to Continue
          </Button>
        </div>
      )}
      
      <div className="w-full max-w-md space-y-3">
        <Button 
          onClick={handleWatchAd}
          disabled={isAdLoading || !isNativeAvailable || !isAuthenticated}
          className="w-full h-16 text-lg font-bold bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white shadow-2xl hover:shadow-3xl active:scale-95 transition-all duration-200 rounded-xl"
        >
          {isAdLoading ? (
            <>
              <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 mr-3 animate-spin" />
              Loading Ad...
            </>
          ) : (
            <>
              <Tv className="w-6 h-6 sm:w-7 sm:h-7 mr-3" />
              Watch Ad & Earn Credit
            </>
          )}
        </Button>
        {!isNativeAvailable && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-xs sm:text-sm text-red-600">
              Ad watching is only available in the mobile app (iOS/Android)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ReferralTabProps {
  isAuthenticated: boolean;
  handleAuthClick: () => void;
}

const ReferralTab = ({ isAuthenticated, handleAuthClick }: ReferralTabProps) => {
  const [info, setInfo] = useState<{ referralCode: string; referralCount: number; creditsEarned: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const APP_URL = import.meta.env.VITE_APP_URL || 'https://app.hairstudio.ai'; 

  useEffect(() => {
    if (isAuthenticated) {
      const fetchReferralInfo = async () => {
        setIsLoading(true);
        const result = await apiService.getReferralInfo();
        if (result.success) {
          setInfo(result.data);
        } else {
          toast.error('Could not load referral info.');
        }
        setIsLoading(false);
      };
      fetchReferralInfo();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getReferralLink = () => {
    if (!info?.referralCode) return APP_URL;
    return `${APP_URL}/?ref=${info.referralCode}`;
  };

  const handleCopy = async () => {
    const link = getReferralLink();
    const textToCopy = `${link}`;
    navigator.clipboard.writeText(textToCopy); 
    toast.success('Referral link & info copied!');
    await triggerHapticFeedback('medium');
  };

  const handleShare = async () => {
  const link = getReferralLink();
  await triggerHapticFeedback('medium');

  // Define the full text message separately
  const fullMessage = `
You should try Hair Studio! 💇‍♀️ Use AI to see how you'd look with hundreds of hairstyles. 
Download with my link to get 5 FREE credits:
${link}
  `;

  try {
    await Share.share({
      message: fullMessage, 
      url: link, 
      title: 'Try Hair Studio - AI Hairstyles!',
      dialogTitle: 'Share Hair Studio with friends',
    }, {
      subject: 'My referral link for Hair Studio',
    });
  } catch (error) {
      navigator.clipboard.writeText(link);
      toast.success('Referral link copied!'); 
  }
};

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center px-4 sm:py-8 sm:px-8 space-y-6 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl shadow-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Refer Friends, Earn Credits
          </h3>
          <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Sign in to get your unique referral link. You'll earn 
            <span className="font-bold text-blue-700"> 5 free credits</span> for every friend who signs up!
          </p>
        </div>
        <div className="w-full max-w-md space-y-3 sm:space-y-4">
          <Button 
            onClick={handleAuthClick} 
            className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Sign In to Get Your Link
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:py-8 sm:px-8 space-y-6 sm:space-y-8">
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl shadow-lg">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Refer Friends, Earn Credits
        </h3>
        <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Share your link with friends. When they sign up, you'll get 
          <span className="font-bold text-blue-700"> 5 free credits!</span>
        </p>
      </div>

      <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/50 overflow-hidden">
        <CardContent className="p-5 sm:p-6 grid grid-cols-2 gap-4 divide-x divide-blue-200/70">
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <Users className="w-7 h-7 text-blue-600" />
            <span className="text-3xl font-extrabold text-blue-900">
              {info?.referralCount || 0}
            </span>
            <span className="text-sm font-medium text-blue-700">Friends Joined</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <Coins className="w-7 h-7 text-amber-600" />
            <span className="text-3xl font-extrabold text-amber-900">
              {info?.creditsEarned || 0}
            </span>
            <span className="text-sm font-medium text-amber-700">Credits Earned</span>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-md space-y-4">
        <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <span className="text-xl sm:text-2xl font-bold text-gray-700 tracking-wider">
            {info?.referralCode || '...'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="h-12 text-base font-semibold"
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy Link
          </Button>
          <Button
            onClick={handleShare}
            className="h-12 text-base font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Pricing Modal Component ---
interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { 
    storeReady, 
    creditPacks,
    isProcessingProductId,
    buyCredits,
    userCredits
  } = usePayment();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('credits');

  const handleAuthClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleBuyClick = async (productId: string) => {
    await triggerHapticFeedback('medium');
    await buyCredits(productId);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className={cn(
            "w-full mx-auto p-0 gap-0 flex flex-col",
            "fixed bottom-0 left-0 right-0 top-auto translate-x-0 translate-y-0",
            "min-h-[85vh] max-h-[92vh] rounded-t-3xl border-t-4 border-amber-500 border-l-0 border-r-0",
            "sm:max-h-[85vh] sm:max-w-2xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2",
            "lg:fixed lg:top-1/2 lg:left-1/2 lg:bottom-auto lg:-translate-x-1/2 lg:-translate-y-1/2",
            "lg:max-w-4xl lg:max-h-[90vh] lg:rounded-2xl lg:border-0 lg:shadow-2xl",
            "xl:max-w-6xl"
          )}
        >
          <DialogHeader className="px-4 py-4 sm:px-6 lg:px-8 border-b bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-3xl lg:rounded-t-2xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center justify-center sm:justify-start flex-1 sm:flex-none gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Coins className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Get More Credits
                </DialogTitle>
              </div>
              
              {isAuthenticated && (
                <div className="hidden sm:flex px-4 py-2 lg:px-5 lg:py-2.5 bg-white rounded-full border-2 border-amber-200 shadow-md">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 lg:w-6 lg:h-6 text-amber-600" />
                    <span className="text-amber-900 font-bold text-sm lg:text-base">
                       {Number(userCredits).toFixed(2)} Credits
                    </span>
                  </div>
                </div>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full hover:bg-white/80 active:scale-90 transition-all lg:hidden" 
                onClick={() => { 
                  triggerHapticFeedback('light'); 
                  onClose(); 
                }}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>

            {isAuthenticated && (
              <div className="flex sm:hidden justify-center mt-4">
                <div className="px-5 py-2.5 bg-white rounded-full border-2 border-amber-200 shadow-md">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-900 font-bold text-base">
                      Balance: {Number(userCredits).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full items-center flex-col flex">
              <TabsList className={cn(
                "inline-flex h-auto items-center justify-center rounded-full bg-slate-100 p-1.5 px-2 mx-2", 
                "mb-6 sm:mb-8"
              )}>
                <TabsTrigger 
                  value="credits" 
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm sm:text-base font-medium ring-offset-background transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 hover:data-[state=inactive]:bg-slate-200/50 hover:data-[state=inactive]:text-slate-700",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                  )}
                  onClick={() => triggerHapticFeedback('light')}
                >
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" /> 
                  Buy Credits
                </TabsTrigger>
             {Capacitor.isNativePlatform() &&   <TabsTrigger 
                  value="ads" 
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm sm:text-base font-medium ring-offset-background transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 hover:data-[state=inactive]:bg-slate-200/50 hover:data-[state=inactive]:text-slate-700",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                  )}
                  onClick={() => triggerHapticFeedback('light')}
                >
                  <Tv className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" /> 
                  Free Credits
                </TabsTrigger>
              }
                <TabsTrigger 
                  value="referrals" 
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm sm:text-base font-medium ring-offset-background transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 hover:data-[state=inactive]:bg-slate-200/50 hover:data-[state=inactive]:text-slate-700",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                  )}
                  onClick={() => triggerHapticFeedback('light')}
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" /> 
                  Refer & Earn
                </TabsTrigger>
              </TabsList>
            
              <TabsContent value="credits" className="space-y-6 sm:space-y-8 w-full min-h-screen">
                <div className="text-center space-y-2 sm:space-y-3">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Choose Your Pack
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                    Pay as you use. Credits never expire.
                  </p>
                </div>
  
 {Capacitor.isNativePlatform() ? <PaywallScreen onClose={onClose}  /> : <WebPaywallScreen  onClose={onClose} userId={user?.id}  /> }
                    
         
              </TabsContent>

              <TabsContent value="ads">
                <AdCreditTab 
                  refreshUser={refreshUser}
                  isAuthenticated={isAuthenticated}
                  handleAuthClick={handleAuthClick}
                />
              </TabsContent>

              <TabsContent value="referrals">
                <ReferralTab 
                  isAuthenticated={isAuthenticated} 
                  handleAuthClick={handleAuthClick}
                />
              </TabsContent>
            </Tabs>
          </div>

          {activeTab === 'credits' && (
            <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 border-t bg-gray-50">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <p className="text-xs sm:text-sm text-center">
                  Secure payment • 30-day money-back guarantee
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        title="Sign in to Continue"
        description="Create your account to get more credits and access premium features."
        showProBenefits={false}
      />
    </>
  );
}