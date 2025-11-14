// src/components/WebPaywallScreen.tsx

import React from 'react';
import { Zap, Unlock, Clock, Star, TrendingUp, Gem, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';




const DODO_PAYMENT_URLS: Record<string, string> = {
  'pdt_pfhTvWTjDJAIDqBe8r8Ab': `https://checkout.dodopayments.com/buy/pdt_pfhTvWTjDJAIDqBe8r8Ab?quantity=1&redirect_url=${import.meta.env.VITE_WEB_DODO_PAYMENT_REDIRECT_URL}`, 
  'pdt_s6wp6uV54N8VlApn5MKqU': `https://checkout.dodopayments.com/buy/pdt_s6wp6uV54N8VlApn5MKqU?quantity=1&redirect_url=${import.meta.env.VITE_WEB_DODO_PAYMENT_REDIRECT_URL}`, 
  'pdt_P4zhEuGkXT30Kg3OKr9zM': `https://checkout.dodopayments.com/buy/pdt_P4zhEuGkXT30Kg3OKr9zM?quantity=1&redirect_url=${import.meta.env.VITE_WEB_DODO_PAYMENT_REDIRECT_URL}`, 
  'pdt_NQ0vZ7eaMMMZJEEMiLHWz': `https://checkout.dodopayments.com/buy/pdt_NQ0vZ7eaMMMZJEEMiLHWz?quantity=1&redirect_url=${import.meta.env.VITE_WEB_DODO_PAYMENT_REDIRECT_URL}`, 
  'pdt_ZaJToyG0j8zfq1zbcDMUD': `https://checkout.dodopayments.com/buy/pdt_ZaJToyG0j8zfq1zbcDMUD?quantity=1&redirect_url=${import.meta.env.VITE_WEB_DODO_PAYMENT_REDIRECT_URL}`, 

};

// Frontend representation of the credit packs (using the descriptions you requested)
const WEB_CREDIT_PACKS = [
    { id: 'pdt_pfhTvWTjDJAIDqBe8r8Ab', name: 'Starter Pack', credits: 25, price: '$1.49', icon: Star, description: "Style ready. Secure 25 credits to start building your portfolio." },
    { id: 'pdt_s6wp6uV54N8VlApn5MKqU', name: 'Essential Pack', credits: 100, price: '$5.89', icon: Gem, description: "Max value. Get 100 credits for continuous style discovery." },
    { id: 'pdt_P4zhEuGkXT30Kg3OKr9zM', name: 'Stylist Pack', credits: 250, price: '$12.48', icon: Unlock, description: "Power user. Secure 250 credits style pack." },
    { id: 'pdt_NQ0vZ7eaMMMZJEEMiLHWz', name: 'VIP Pack', credits: 1000, price: '$44.99', icon: Unlock, description: "VIP user. Secure 1000 credits for high-volume use." },
    { id: 'pdt_ZaJToyG0j8zfq1zbcDMUD', name: 'Premium Pack', credits: 10000, price: '$100', icon: Clock, description: "Ultimate freedom. Never worry about credits again." },
];

interface WebPaywallProps {
    userId: string | number;
    currentCredits: number;
    onClose: () => void;
}

const PaywallItem: React.FC<typeof WEB_CREDIT_PACKS[0] & { userId: string | number }> = ({ id, name, credits, price, icon: Icon, description, userId }) => {
    
    const paymentUrlTemplate = DODO_PAYMENT_URLS[id] || DODO_PAYMENT_URLS['credits25']; 
    
    const handleRedirect = () => {
        toast.info("Redirecting you to the secure payment page...", { duration: 2000 });
        window.location.href = paymentUrlTemplate; // Direct redirection to Dodopayment
    };

    return (
        <Card className="flex items-center justify-between p-4 bg-white hover:border-amber-500 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
                <Icon className="w-6 h-6 text-amber-500 shrink-0" />
                <div className="text-left">
                    <CardTitle className="text-lg font-bold">{name} <span className="text-sm text-gray-500 ml-2">({credits} Credits)</span></CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">{description}</CardDescription>
                </div>
            </div>
            <Button onClick={handleRedirect} className="bg-amber-600 hover:bg-amber-700 font-bold px-6 shrink-0">
                Buy {price}
            </Button>
        </Card>
    );
};


export const WebPaywallScreen: React.FC<WebPaywallProps> = ({ userId, currentCredits, onClose }) => {
    return (
        <div className="bg-white/95 backdrop-blur-sm flex justify-center items-center overflow-y-auto p-6">
                
                <div className="space-y-4">
                    {WEB_CREDIT_PACKS.map((pack) => (
                        <PaywallItem key={pack.id} {...pack} userId={userId} />
                    ))}
            </div>
        </div>
    );
};