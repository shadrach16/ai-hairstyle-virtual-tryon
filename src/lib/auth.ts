import { apiService } from './api';
import { toast } from 'sonner';

export const handleSignOut = async () => {
  try {
    await apiService.signOut();
    window.location.reload();
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

export const requiresUpgrade = (user: any, requiredCredits: number) => {
  if (!user) return true;
  return (user.credits || 0) < requiredCredits;
};

export const promptGoogleSignInForPro = () => {
  toast.info('Sign in to unlock Pro features', {
    description: 'Get unlimited generations and premium hairstyles',
    duration: 4000
  });
};