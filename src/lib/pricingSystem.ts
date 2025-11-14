export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceNGN: number;
  priceUSD: number;
  popular?: boolean;
  savings?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  credits: number;
  priceNGN: number;
  priceUSD: number;
  features?: string[];
  popular?: boolean;
  savings?: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 25,
    priceNGN: 2990,
    priceUSD: 2,
    savings: 'Save 25%'
  },
  {
    id: 'value',
    name: 'Value Pack',
    credits: 100,
    priceNGN: 9990,
    priceUSD: 7,
    popular: true,
    savings: 'Save 38%'
  },
  {
    id: 'stylist',
    name: 'Stylist Pack',
    credits: 250,
    priceNGN: 19990,
    priceUSD: 13,
    savings: 'Save 50%'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'pro',
    name: 'Pro Stylist',
    credits: 150,
    priceNGN: 7990,
    priceUSD: 5,
    features: [
      '150 credits per month',
      'Priority processing',
      'HD quality exports',
      'No watermarks',
      'Style history',
      'Email support'
    ],
    popular: true,
    savings: 'Best Value'
  },
  {
    id: 'salon',
    name: 'Salon Professional',
    credits: 500,
    priceNGN: 19990,
    priceUSD: 13,
    features: [
      '500 credits per month',
      'API access',
      'Bulk processing',
      'Commercial license',
      'Custom branding',
      'Priority support',
      '4K quality exports',
      'Advanced analytics'
    ],
    savings: 'For Business'
  }
];