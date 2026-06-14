export interface StorefrontPrice {
  amount: number;
  currency: string;
  formatted: string;
}

export interface RevenueCatStorefront {
  productId: string;
}

export interface DodoStorefront {
  productId: string;
  checkoutBaseUrl: string;
  price: StorefrontPrice;
}

export interface CreditPack {
  id: string;
  type: 'credit_pack';
  name: string;
  description: string;
  credits: number;
  displayLabel: string;
  displayOrder: number;
  popular?: boolean;
  savings?: string;
  storefronts: {
    revenueCat?: RevenueCatStorefront;
    dodo?: DodoStorefront;
  };
}

export interface SubscriptionPlan {
  id: string;
  type: 'subscription';
  name: string;
  description: string;
  creditsPerMonth?: number;
  interval?: 'month' | 'year';
  displayOrder: number;
  popular?: boolean;
  recommended?: boolean;
  savings?: string;
  displayLabel?: string;
  trialDays?: number;
  features?: string[];
  storefronts: {
    revenueCat?: RevenueCatStorefront;
    dodo?: DodoStorefront;
  };
}

export interface PricingCatalog {
  version: string;
  paymentMethods: {
    mobile: string;
    web: string;
  };
  creditPacks: CreditPack[];
  subscriptions: SubscriptionPlan[];
  validation: {
    isValid: boolean;
    errorCount: number;
    warningCount: number;
    errors: string[];
    warnings: string[];
  };
}

export interface UserCredits {
  total: number;
  used: number;
  remaining: number;
  freeTrialUsed: number;
  freeTrialExpiry?: string | null;
}

export function calculateTrialExpiry(durationHours: number = 48): string {
  return new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
}

export function isTrialActive(expiry?: string | null): boolean {
  if (!expiry) {
    return false;
  }

  return new Date(expiry).getTime() > Date.now();
}

export const EMPTY_PRICING_CATALOG: PricingCatalog = {
  version: 'unavailable',
  paymentMethods: {
    mobile: 'RevenueCat (Google Play / App Store)',
    web: 'Dodo Payments'
  },
  creditPacks: [],
  subscriptions: [],
  validation: {
    isValid: false,
    errorCount: 0,
    warningCount: 0,
    errors: [],
    warnings: []
  }
};