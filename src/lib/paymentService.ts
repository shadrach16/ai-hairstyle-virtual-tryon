// lib/paymentService.ts

/**
 * Core credit pack definition
 * This defines the structure and metadata for credit packs.
 * IMPORTANT: Product IDs MUST match exactly with Google Play Console Product IDs
 */
export interface CreditPack {
  id: string;           // MUST match Google Play Product ID exactly
  name: string;         // Display name (fallback if store doesn't load)
  credits: number;      // Number of credits this pack provides
  popular?: boolean;    // Highlight as most popular option
  savings?: string;     // Display savings text (e.g., "Save 15%")
}

/**
 * Extended credit pack with store data
 * This is what usePayment hook returns after merging with store data
 */
export interface CreditPackWithStore extends CreditPack {
  title: string;              // Localized title from store (falls back to name)
  price: string;              // Localized price from store (e.g., "$1.29", "₦500")
  canPurchase: boolean;       // Whether product can be purchased
  costPerImageString?: string; // Calculated cost per image with currency
}

export class PaymentService {
  private static instance: PaymentService;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Get credit pack definitions
   * These IDs MUST match your Google Play Console Product IDs exactly
   * Prices and localization come from the store at runtime
   */
  getCreditPacks(): CreditPack[] {
    return [
      {
        id: 'credits3',
        name: 'Beginners Pack',
        credits: 3,
        savings: undefined, // No discount
      },
      {
        id: 'credits10',
        name: 'Novies Pack',
        credits: 10,
        savings: undefined, // No discount
      },
      {
        id: 'credits25',
        name: 'Essential Pack',
        credits: 25,
        popular: true,
        savings: 'Save 10%',
      },
      {
        id: 'credits100',
        name: 'Value Pack',
        credits: 100,
        savings: 'Save 20%',
      },
      {
        id: 'credits250',
        name: 'Stylist Pack',
        credits: 250,
        savings: 'Save 30%',
      },
      {
        id: 'credits250',
        name: 'Lifetime Access',
        credits: 'Unlimited',
      }
    ];
  }

  /**
   * Helper to get a single pack by ID
   */
  getCreditPackById(id: string): CreditPack | undefined {
    return this.getCreditPacks().find(pack => pack.id === id);
  }

  /**
   * Helper to get credits for a product ID
   */
  getCreditsForProduct(productId: string): number {
    return this.getCreditPackById(productId)?.credits || 0;
  }
}

export const paymentService = PaymentService.getInstance();