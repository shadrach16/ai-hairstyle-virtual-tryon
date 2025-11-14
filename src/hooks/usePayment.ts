// hooks/usePayment.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';

// Import RevenueCat
import {
    Purchases,
    LOG_LEVEL,
    type PurchasesPackage,
    type Offering
} from '@revenuecat/purchases-capacitor';




export function usePayment() {
    const { user, refreshUser } = useAuth();
    const [storeReady, setStoreReady] = useState(false);
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const storeInitialized = useRef(false);

 

    // --- Store Setup Function ---
    const initializeRevenueCat = useCallback(async () => {
        if (storeInitialized.current) {
            console.log("[RC] Already initialized.");
            return;
        }
        storeInitialized.current = true;

        if (!Capacitor.isNativePlatform()) {
            console.warn("[RC] RevenueCat purchases only available on native platforms.");
            return;
        }


        try {
            await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

               await Purchases.configure({ 
                apiKey: import.meta.env.VITE_REVENUECAT_API_KEY,
                appUserID:user.id

            });


            console.log("[RC] Configured successfully");
            Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
                console.log("[RC] CustomerInfo updated, refreshing user data...");
                await refreshUser();
            });

            // 4. Load products ("Offerings" in RevenueCat)
            console.log("[RC] Fetching offerings...");
            const offerings = await Purchases.getOfferings();
            
            if (offerings.current) {
                console.log("[RC] Offerings loaded:", JSON.stringify(offerings.current));
                setPackages(offerings.current.availablePackages);
                setStoreReady(true);
            } else {
                console.warn("[RC] No current offering found.");
                toast.error("No products could be loaded at this time.");
                setStoreReady(true); // Still "ready", just no products
            }
        } catch (error: any) {
            console.error("[RC] Setup failed:", error);
            // toast.error(`Store setup failed: ${error.message || 'Unknown error'}`);
            storeInitialized.current = false;
        }
    }, [refreshUser, user?.id]);

    // --- useEffect to call initializeRevenueCat ---
    useEffect(() => {
        // Capacitor plugins handle device ready, so we can call directly.
        initializeRevenueCat();
    }, [initializeRevenueCat]);

    // --- buyCredits Function (now uses RevenueCat) ---
    const buyCredits = useCallback(async (productId: string) => {
        if (!storeReady) {
            toast.error("Store is not ready, please wait.");
            return;
        }

        if (isProcessing) {
            toast.info("Another purchase is processing.");
            return;
        }

        // Find the RevenueCat Package from the product ID
        const packToBuy = packages.find(p => p.product.identifier === productId);

        if (!packToBuy) {
            toast.error(`Product "${productId}" not found.`);
            console.warn("RC Package not found for product ID:", productId);
            return;
        }

        console.log(`[RC] Initiating order for ${productId}...`);
        setIsProcessing(productId);

        try {
            // This one function handles purchase AND verification
            const { customerInfo, productIdentifier } = await Purchases.purchasePackage({
                aPackage: packToBuy,
            });

            console.log("[RC] Purchase successful:", productIdentifier);
            toast.success("Purchase successful!", {
                description: "Your credits will be added shortly."
            });
            
            // The listener will call refreshUser, but we can call it
            // here as well to speed things up if the webhook is fast.
            await refreshUser();

        } catch (err: any) {
            if (err.userCancelled) {
                console.log("[RC] Purchase cancelled by user.");
            } else {
                console.error(`[RC] Order initiation failed for ${productId}:`, err);
                toast.error(`Purchase failed: ${err.message || 'Store error'}`);
            }
        } finally {
            setIsProcessing(null); // Clear on success, error, or cancel
        }
    }, [storeReady, isProcessing, packages, refreshUser]);

 

    return {
        // We return `storeReady` and `isProcessingProductId` to match
        // the original hook's signature, so the UI file doesn't break.
        storeReady: storeReady,
        isProcessingProductId: isProcessing,
        buyCredits,
        userCredits: user?.credits || 0,
        isPro: user?.isPro || false,
        packages: packages, 
    };
}