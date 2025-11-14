import { calculateTrialExpiry, isTrialActive, type UserCredits } from './pricingSystem';

export interface UserSession {
  id: string;
  isPaid: boolean;
  credits: UserCredits;
  subscriptionPlan?: string;
  referralCode?: string;
  referralsCount: number;
  loyaltyPoints: number;
  lastLoginDate: string;
  consecutiveLogins: number;
}

const STORAGE_KEY = 'african_hair_studio_session';

export function getOrCreateSession(): UserSession {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const session = JSON.parse(stored) as UserSession;
      
      // Check daily login bonus
      const today = new Date().toDateString();
      if (session.lastLoginDate !== today) {
        if (session.lastLoginDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
          session.consecutiveLogins += 1;
        } else {
          session.consecutiveLogins = 1;
        }
        
        // Award daily login bonus after 3 consecutive days
        if (session.consecutiveLogins >= 3) {
          session.credits.total += 1;
          session.consecutiveLogins = 0; // Reset counter
        }
        
        session.lastLoginDate = today;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      }
      
      return session;
    }
  } catch (error) {
    console.error('Error loading session:', error);
  }

  // Create new session with free trial
  const newSession: UserSession = {
    id: Math.random().toString(36).substring(7),
    isPaid: false,
    credits: {
      total: 5, // Free trial credits
      used: 0,
      remaining: 5,
      freeTrialUsed: 0,
      freeTrialExpiry: calculateTrialExpiry()
    },
    referralCode: generateReferralCode(),
    referralsCount: 0,
    loyaltyPoints: 0,
    lastLoginDate: new Date().toDateString(),
    consecutiveLogins: 1
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
  return newSession;
}

export function canGenerate(requiredCredits: number = 1): boolean {
  const session = getOrCreateSession();
  
  // Check if in free trial
  if (isTrialActive(session.credits.freeTrialExpiry)) {
    return session.credits.freeTrialUsed < 5;
  }
  
  // Check regular credits
  return (session.credits.total - session.credits.used) >= requiredCredits;
}

export function getRemainingCredits(): number {
  const session = getOrCreateSession();
  
  // If in trial, return trial credits remaining
  if (isTrialActive(session.credits.freeTrialExpiry)) {
    return Math.max(0, 5 - session.credits.freeTrialUsed);
  }
  
  return Math.max(0, session.credits.total - session.credits.used);
}

export function useCredits(amount: number = 1): UserSession {
  const session = getOrCreateSession();
  
  // Use trial credits first
  if (isTrialActive(session.credits.freeTrialExpiry)) {
    session.credits.freeTrialUsed += amount;
  } else {
    session.credits.used += amount;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function addCredits(amount: number): UserSession {
  const session = getOrCreateSession();
  session.credits.total += amount;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function upgradeToPaid(planId?: string): UserSession {
  const session = getOrCreateSession();
  session.isPaid = true;
  if (planId) {
    session.subscriptionPlan = planId;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function isInFreeTrial(): boolean {
  const session = getOrCreateSession();
  return isTrialActive(session.credits.freeTrialExpiry);
}

export function getTrialTimeRemaining(): string | null {
  const session = getOrCreateSession();
  if (!session.credits.freeTrialExpiry) return null;
  
  const now = new Date();
  const expiry = new Date(session.credits.freeTrialExpiry);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) return null;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function addReferralBonus(): UserSession {
  const session = getOrCreateSession();
  session.credits.total += 5; // Referrer bonus
  session.referralsCount += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function addSocialShareBonus(): UserSession {
  const session = getOrCreateSession();
  session.credits.total += 1;
  session.loyaltyPoints += 10;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

function generateReferralCode(): string {
  return 'AHS' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function shouldShowWatermark(): boolean {
  const session = getOrCreateSession();
  
  // No watermark during trial or for paid users
  if (isTrialActive(session.credits.freeTrialExpiry) || session.isPaid) {
    return false;
  }
  
  // Show watermark for free tier users
  return true;
}