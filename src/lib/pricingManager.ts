export interface CreditPack {
  id: string;
  name: string;
  images: number;
  price: number;
  pricePerImage: number;
  profitMargin: number;
  popular?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  imagesPerMonth: number;
  rollover: boolean;
  maxRollover: number;
  features: string[];
  popular?: boolean;
}

export interface UserCredits {
  total: number;
  used: number;
  remaining: number;
  expiryDate?: string;
  source: 'trial' | 'purchase' | 'subscription' | 'referral' | 'loyalty';
}

// Credit Packs (Usage-Based Pricing)
export const creditPacks: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    images: 25,
    price: 2.00,
    pricePerImage: 0.08,
    profitMargin: 50
  },
  {
    id: 'value',
    name: 'Value Pack',
    images: 100,
    price: 6.00,
    pricePerImage: 0.06,
    profitMargin: 33,
    popular: true
  },
  {
    id: 'stylist',
    name: 'Stylist Pack',
    images: 250,
    price: 12.50,
    pricePerImage: 0.05,
    profitMargin: 20
  }
];

// Subscription Plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 7.99,
    imagesPerMonth: 150,
    rollover: true,
    maxRollover: 300,
    features: [
      'Bulk Downloads',
      'Custom Prompts',
      'Priority Processing',
      'No Watermarks',
      'HD Resolution'
    ]
  },
  {
    id: 'salon',
    name: 'Salon',
    monthlyPrice: 19.99,
    imagesPerMonth: 500,
    rollover: true,
    maxRollover: 1000,
    features: [
      'API Access',
      'Webhook Integration',
      'Priority Processing',
      'Bulk Downloads',
      'Custom Branding',
      'Analytics Dashboard',
      'Multiple Users'
    ],
    popular: true
  }
];

// Free Trial Configuration
export const freeTrialConfig = {
  credits: 5,
  durationHours: 48,
  costPerCredit: 0.04,
  totalCost: 0.20
};

// Pricing calculations
export function calculatePackValue(pack: CreditPack): string {
  const savings = ((creditPacks[0].pricePerImage - pack.pricePerImage) / creditPacks[0].pricePerImage) * 100;
  return savings > 0 ? `Save ${Math.round(savings)}%` : '';
}

export function calculateSubscriptionValue(plan: SubscriptionPlan): string {
  const pricePerImage = plan.monthlyPrice / plan.imagesPerMonth;
  const savings = ((creditPacks[0].pricePerImage - pricePerImage) / creditPacks[0].pricePerImage) * 100;
  return `Save ${Math.round(savings)}% vs credits`;
}

// Referral system
export const referralConfig = {
  creditsPerReferral: 5,
  costPerReferral: 0.20,
  minimumPurchaseRequired: true
};

// Loyalty rewards
export const loyaltyConfig = {
  loginStreak: {
    days: 3,
    reward: 1
  },
  socialShare: {
    reward: 1,
    dailyLimit: 1
  }
};

// Upsell configuration
export const upsellConfig = {
  hdResolution: {
    extraCredits: 1,
    description: 'Generate 4K high-resolution image for printing'
  },
  threeSixtyView: {
    extraCredits: 2,
    description: 'Generate 360-degree view with back and side angles'
  }
};