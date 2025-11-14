import { paymentService } from './paymentService';
import { toast } from 'sonner';

export const purchaseCreditPack = async (packId: string): Promise<boolean> => {
  try {
    const result = await paymentService.purchaseCreditPack(packId);
    return result.success;
  } catch (error) {
    console.error('Purchase error:', error);
    toast.error('Purchase failed. Please try again.');
    return false;
  }
};

export const purchaseSubscription = async (planId: string): Promise<boolean> => {
  try {
    const result = await paymentService.purchaseSubscription(planId);
    return result.success;
  } catch (error) {
    console.error('Subscription error:', error);
    toast.error('Subscription failed. Please try again.');
    return false;
  }
};