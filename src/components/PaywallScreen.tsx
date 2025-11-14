// components/PaywallScreen.tsx
import React from 'react';
// Assuming usePayment has been modified to export 'packages'
import { usePayment } from '../hooks/usePayment'; 
import { PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { Zap, Unlock, X, Loader2 } from 'lucide-react'; 

// Define a simple structure for the credit packs to help map the UI
interface CreditPackDisplay {
    // We only need the display details and the productId for mapping
    credits: number | string;
    description: string;
    productId: string;
    icon: React.ReactNode;
}

// --- Component for a single Paywall item ---
interface PaywallItemProps {
    pack: PurchasesPackage;
    credits: number | string;
    description: string;
    icon: React.ReactNode;
    isProcessing: boolean | string; // Type is string (productId) or boolean (general processing state)
    buyCredits: (productId: string) => Promise<void>;
}

const PaywallItem: React.FC<PaywallItemProps> = ({ pack, credits, description, icon, isProcessing, buyCredits }) => {
    const isCurrentProcessing = isProcessing === pack.product.identifier;
    
    // RevenueCat's package contains the formatted price
    const formattedPrice = pack.product.priceString;
    const isUnlimited = pack.product.identifier === 'unlimited';

    return (
        <button
            onClick={() => buyCredits(pack.product.identifier)}
            disabled={!!isProcessing} // Disable if any purchase is processing
            className={`
                flex items-center justify-between p-1 my-2 rounded-xl text-white transition-colors duration-200 w-full
                ${isCurrentProcessing ? 'bg-indigo-600/70' : 'bg-gray-800 hover:bg-gray-700'}
                ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <div className="flex items-center">
                {/* Visual element on the left (like the diamond in your image) */}
                <div className={`p-1.5 rounded-full ${isUnlimited ? 'bg-yellow-400' : 'bg-indigo-500'}`}>
                    {icon}
                </div>
                <div className="ml-4 text-left">
                    <p className="text-lg font-semibold">
                        {credits} {isUnlimited ? '' : 'credits'}
                    </p>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>
            </div>
            {/* Price Button */}
            <div className="flex-shrink-0">
                <div className={`
                    px-5 p-2 rounded-full font-bold transition-colors duration-200
                    ${isCurrentProcessing 
                        ? 'bg-white text-indigo-700' 
                        : isUnlimited 
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                            : 'bg-indigo-500 text-white hover:bg-indigo-400'
                    }
                `}>
                    {isCurrentProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : formattedPrice}
                </div>
            </div>
        </button>
    );
};


// --- Main Paywall Screen Component ---

export const PaywallScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // 1. Destructure the packages array from the usePayment hook
    const { 
        storeReady, 
        isProcessingProductId, 
        buyCredits,
        packages // <--- Now using the real packages from the hook
    } = usePayment();

    // 2. Define the static display data, mapping the product IDs to the UI names
    // This uses the product IDs from your log data (e.g., 'credits3', 'credits25') 
    // and the labels from your design image (e.g., '3 credits', 'Novies Pack').
    const displayPacks: CreditPackDisplay[] = [
        { credits: 3, description: 'Beginners Pack', productId: 'credits3', icon: <Zap className="w-5 h-5 text-indigo-100" /> },
        { credits: 10, description: 'Novies Pack', productId: 'credits10', icon: <Zap className="w-5 h-5 text-indigo-100" /> },
        { credits: 25, description: 'Essential Pack', productId: 'credits25', icon: <Zap className="w-5 h-5 text-indigo-100" /> },
        { credits: 100, description: 'Value Pack', productId: 'credits100', icon: <Zap className="w-5 h-5 text-indigo-100" /> },
        { credits: 250, description: 'Stylist Pack', productId: 'credits250', icon: <Zap className="w-5 h-5 text-indigo-100" /> },
        { credits: 'Lifetime Access', description: 'Lifetime Access (VIP)', productId: 'unlimited', icon: <Unlock className="w-5 h-5 text-gray-900" /> },
    ];


    // 3. Combine display data with RevenueCat package data
    const paywallItems = displayPacks.map(displayPack => {
        const rcPackage = packages.find(p => p.product.identifier === displayPack.productId);
        return rcPackage ? { ...displayPack, rcPackage } : null;
    }).filter(item => item !== null) as (CreditPackDisplay & { rcPackage: PurchasesPackage })[];


    if (!storeReady) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-900/90 text-white p-6 rounded-lg">
                <Loader2 className="w-8 h-8 mr-3 animate-spin text-indigo-400" />
                <p>Loading payment options...</p>
            </div>
        );
    }
    
    // Show a message if store is ready but no items were fetched (e.g., config error)
    if (paywallItems.length === 0) {
         return (
            <div className="relative h-full max-h-[80vh] w-full max-w-md mx-auto p-6 bg-gray-900 rounded-3xl shadow-2xl">
                 <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-white transition">
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-white text-center mb-6 mt-12">
                    Store Offline
                </h2>
                <p className="text-center text-gray-400">
                    We're having trouble loading the products. Please try again later.
                </p>
                <div className="flex justify-center space-x-6 text-sm mt-8 text-gray-400">
                    {/* Placeholder: You can add a refresh button here */}
                </div>
            </div>
        );
    }


    return (
        // The container mimics the dark, rounded screen from your image
        <div className="relative h-full max-h-[80vh] w-full max-w-md mx-auto p-2 bg-gray-900 rounded-3xl shadow-2xl">
           
            {/* List of Credit Packs */}
            <div className="space-y-3 w-full  overflow-y-auto pr-2">
                {paywallItems.map((item) => (
                    <PaywallItem
                        key={item?.productId}
                        pack={item?.rcPackage}
                        credits={item?.credits}
                        description={item?.description}
                        icon={item?.icon}
                        isProcessing={isProcessingProductId}
                        buyCredits={buyCredits}
                    />
                ))}
            </div>

            {/* Footer Links */}
            <div className="flex justify-center space-x-6 text-sm mt-8 text-gray-400">
            
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Terms</a>
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Privacy</a>
            </div>
        </div>
    );
};