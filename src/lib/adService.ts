import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdMobRewardItem,
  RewardAdOptions,
  RewardAdPluginEvents,
  // Removed RequestConfiguration import as it's not supported
} from '@capacitor-community/admob';

// --- Configuration Constants ---
const PRODUCTION_APP_ID = 'ca-app-pub-3840102724542989~4033396773'; 
// 🚨 Production Rewarded Ad Unit ID
const PRODUCTION_REWARDED_AD_ID = 'ca-app-pub-3840102724542989/6060067964';

// --- Type Definitions (Kept for clarity) ---
export interface AdConfig {
  adUnitId: string;
  testMode: boolean;
}

export interface AdResult {
  success: boolean;
  completed: boolean;
  reward?: AdMobRewardItem;
}

export interface AdReward {
  type: string;
  amount: number;
}

// --- Ad Service Class ---
class AdService {
  private static isInitialized = false;
  private static admobPlugin: any = null;
  private static areListenersAdded = false;

  static isNative(): boolean {
    try {
      return Capacitor.isNativePlatform();
    } catch (error) {
      return false;
    }
  }

  static async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      if (this.isNative()) {
        this.admobPlugin = AdMob;

        await this.admobPlugin.initialize({
         appId: PRODUCTION_APP_ID,
        });

        console.log('AdMob initialized successfully .');
        this.addRewardedAdListeners();
      } else {
        console.log('AdMob not available, using web simulation');
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('AdMob initialization failed:', error);
      this.isInitialized = true;
      return false;
    }
  }

  private static trackAdInteraction(adType: 'rewarded', action: 'shown' | 'clicked' | 'completed' | 'skipped'): void {
    try {
      console.log(`Ad Interaction: ${adType} - ${action}`);
    } catch (error) {
      console.error('Error tracking ad interaction:', error);
    }
  }

  private static addRewardedAdListeners(): void {
    if (this.areListenersAdded || !this.admobPlugin) return;

    // Listeners are generally backward compatible and are fine.
    this.admobPlugin.addListener(RewardAdPluginEvents.Loaded, () => {
      console.log('REWARDED AD: Loaded');
    });

    this.admobPlugin.addListener(RewardAdPluginEvents.FailedToLoad, (error: any) => {
      console.error('REWARDED AD: FailedToLoad', error);
      toast.error(`Ad Load Failed: ${error.message || 'No fill.'}`);
    });

    this.admobPlugin.addListener(RewardAdPluginEvents.Showed, () => {
      console.log('REWARDED AD: Showed');
      this.trackAdInteraction('rewarded', 'shown');
    });

    this.admobPlugin.addListener(RewardAdPluginEvents.FailedToShow, (error: any) => {
      console.error('REWARDED AD: FailedToShow', error);
      toast.error('Ad Show Failed.');
    });

    this.admobPlugin.addListener(RewardAdPluginEvents.Dismissed, () => {
      console.log('REWARDED AD: Dismissed');
    });

    this.admobPlugin.addListener(RewardAdPluginEvents.Rewarded, (rewardItem: AdMobRewardItem) => {
      console.log('REWARDED AD: User earned reward:', rewardItem);
    });

    this.areListenersAdded = true;
  }

  static async showRewardedAd(testMode: boolean = true): Promise<AdResult> {
    try {
      await this.initialize();

      if (this.isNative() && this.admobPlugin) {
        return await this.showNativeRewardedAd(testMode);
      } else {
        return await this.simulateRewardedAd();
      }
    } catch (error) {
      console.error('Rewarded ad failed:', error);
      toast.error('Failed to load advertisement.');
      return { success: false, completed: false };
    }
  }

  // REVERTED to older methods: prepareRewardVideoAd and showRewardVideoAd
  private static async showNativeRewardedAd(testMode: boolean): Promise<AdResult> {
    if (!this.admobPlugin) return { success: false, completed: false };


    // Use the PRODUCTION Ad Unit ID
    const adUnitId = PRODUCTION_REWARDED_AD_ID;

    const prepareOptions: RewardAdOptions = { adId: adUnitId };

    return new Promise<AdResult>(async (resolve) => {
      let rewardReceived: AdMobRewardItem | undefined;

      const rewardedListener = this.admobPlugin.addListener(
        RewardAdPluginEvents.Rewarded, 
        (rewardItem: AdMobRewardItem) => {
          rewardReceived = rewardItem;
        }
      );

      const dismissedListener = this.admobPlugin.addListener(
        RewardAdPluginEvents.Dismissed, 
        () => {
          const result: AdResult = {
            success: true,
            completed: !!rewardReceived,
            reward: rewardReceived,
          };
          
          if (rewardReceived) {
            this.trackAdInteraction('rewarded', 'completed');
          } else {
             this.trackAdInteraction('rewarded', 'skipped');
          }
          
          rewardedListener.remove();
          dismissedListener.remove();
          
          resolve(result);
        }
      );
      
      try {
        // 1. Prepare (Load) the ad - using the OLD method name
        await this.admobPlugin.prepareRewardVideoAd(prepareOptions);
        toast.info('Ad loaded. Showing now...');
        
        // 2. Show the ad - using the OLD method name
        await this.admobPlugin.showRewardVideoAd(); 

      } catch (error) {
        console.error('Ad load/show sequence failed:', error);
        
        rewardedListener.remove();
        dismissedListener.remove();
        
        resolve({ 
            success: false, 
            completed: false 
        });
      }
    });
  }

  private static async simulateRewardedAd(): Promise<AdResult> {
    return new Promise((resolve) => {
      toast.info('🎬 Loading rewarded video ad (Simulation)...');
      setTimeout(() => {
        const rewardItem: AdMobRewardItem = { type: 'support', amount: 1 };
        toast.success('🎉 Ad completed! Thank you for your support.');
        resolve({ success: true, completed: true, reward: rewardItem });
      }, 3000);
    });
  }
}

export { AdService };