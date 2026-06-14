// src/components/WebPaywallScreen.tsx

import React from 'react';
import { Star, TrendingUp, Gem, Unlock, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import type { CreditPack } from '@/lib/pricingSystem';
import { cn } from '@/lib/utils';

function buildDodoCheckoutUrl(pack: CreditPack): string | null {
    const dodo = pack.storefronts.dodo;
    if (!dodo) {
        return null;
    }

    const redirectUrl = encodeURIComponent(
        import.meta.env.VITE_WEB_DODO_PAYMENT_REDIRECT_URL || window.location.origin
    );

    return `${dodo.checkoutBaseUrl}/${dodo.productId}?quantity=1&redirect_url=${redirectUrl}`;
}

function iconForPack(pack: CreditPack) {
    if (pack.popular) return Gem;
    if (pack.credits >= 1000) return Unlock;
    if (pack.credits >= 250) return TrendingUp;
    return Star;
}

interface WebPaywallProps {
    userId: string | number;
    onClose: () => void;
}

const PackCard: React.FC<{ pack: CreditPack; isPopular?: boolean }> = ({ pack, isPopular }) => {
    const Icon = iconForPack(pack);
    const paymentUrl = buildDodoCheckoutUrl(pack);
    const price = pack.storefronts.dodo?.price.formatted;

    const handleRedirect = () => {
        if (!paymentUrl) {
            toast.error('This pack is not available on web checkout.');
            return;
        }
        toast.info("Redirecting to secure payment...", { duration: 2000 });
        window.location.href = paymentUrl;
    };

    return (
        <button
            onClick={handleRedirect}
            className={cn(
                'w-full text-left p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98]',
                isPopular
                    ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white ring-1 ring-[#1a1a1a]'
                    : 'border-gray-100 bg-white hover:border-gray-200'
            )}
        >
            {isPopular && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white text-[#1a1a1a] px-2 py-0.5 rounded-full mb-2.5">
                    Most popular
                </span>
            )}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                        isPopular ? 'bg-white/15' : 'bg-gray-50'
                    )}>
                        <Icon className={cn('w-5 h-5', isPopular ? 'text-white' : 'text-gray-400')} />
                    </div>
                    <div>
                        <p className={cn('text-[15px] font-bold leading-tight', isPopular ? 'text-white' : 'text-gray-900')}>
                            {pack.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Coins className={cn('w-3 h-3', isPopular ? 'text-white/50' : 'text-gray-300')} />
                            <span className={cn('text-[12px] font-medium', isPopular ? 'text-white/60' : 'text-gray-400')}>
                                {pack.displayLabel}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={cn(
                    'h-9 px-4 rounded-xl flex items-center justify-center text-[14px] font-bold flex-shrink-0',
                    isPopular
                        ? 'bg-white text-[#1a1a1a]'
                        : 'bg-[#1a1a1a] text-white'
                )}>
                    {price}
                </div>
            </div>
            {pack.description && (
                <p className={cn('text-[11px] mt-2 leading-relaxed', isPopular ? 'text-white/50' : 'text-gray-400')}>
                    {pack.description}
                </p>
            )}
        </button>
    );
};


export const WebPaywallScreen: React.FC<WebPaywallProps> = ({ userId, onClose }) => {
    const { creditPacks, isCatalogLoading } = usePayment();
    const webPacks = creditPacks
        .filter((pack) => pack.storefronts.dodo)
        .sort((left, right) => left.displayOrder - right.displayOrder);

    if (isCatalogLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {webPacks.map((pack) => (
                <PackCard key={pack.id} pack={pack} isPopular={pack.popular} />
            ))}
        </div>
    );
};