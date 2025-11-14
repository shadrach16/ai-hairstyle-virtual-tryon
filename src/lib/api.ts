// Real API service for Afro AI
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPro: boolean;
  credits: number;
  subscriptionPlan?: string;
  subscriptionExpiry?: string;
  createdAt: string;
}

export interface Hairstyle {
  id: string;
  name: string;
  description: string;
  category: string;
  gender: 'male' | 'female' | 'unisex';
  thumbnail: string;
  price: number;
  tags: string[];
  culturalOrigin?: string;
  popularity: number;
  estimatedTime: string;
  maintenance: string;
  difficulty: string;
  isActive: boolean;
  isNew?: boolean;
  isPremium?: boolean;
}

export interface HairstyleListResponse {
  status: 'success' | 'error';
  results: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: {
    hairstyles: Hairstyle[];
  };
}

export interface Generation {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedImageUrl?: string;
  processingTime?: number;
  errorMessage?: string;
  hairstyle: any;
  createdAt: string;
}

export interface HairstyleAnalysisResponse {
    success: boolean;
    ai_description: string;
    message?: string;
}


class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }


async verifyGooglePlayPurchase(data: {
        productId: string;
        purchaseToken: string;
        packageName: string; // Get this from your capacitor config or .env
    }): Promise<{ success: boolean; message?: string; creditsGranted?: number }> {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/verify-google-play`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result; // Should match the backend response { success: boolean, message: string, creditsGranted: number }
        } catch (error) {
            console.error('Verify Google Play purchase error:', error);
            return { success: false, message: 'Network error during verification.' };
        }
    }

    
  // Authentication
async signInWithGoogle(googleData: any): Promise<{ success: boolean; data?: { user: User; token: string }; message?: string }> { // Added optional data/message
    // 1. Check for a pending referral code captured by the landing page
    const pendingReferralCode = localStorage.getItem('referral_code');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: googleData.credential,
          email: googleData.email,
          name: googleData.name,
          avatar: googleData.avatar,
          googleId: googleData.sub,
          // 2. Send the pending code if it exists
          referralCode: pendingReferralCode || undefined // Send undefined if null/empty
        })
      });

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data.user));
        // Referral used (or wasn't present), clear pending code
        localStorage.removeItem('referral_code');

        const basePlayStoreUrl = localStorage.getItem('basePlayStoreUrl')
        localStorage.removeItem('basePlayStoreUrl');

        if (basePlayStoreUrl){
window.location.assign(basePlayStoreUrl);
        }  
        return { success: true, data: result.data, message: result.message };
      } else {
        // Sign-in failed on backend, still clear pending code
        localStorage.removeItem('referral_code');
        return { success: false, message: result.message || 'Backend sign-in failed.' };
      }

    } catch (error: any) {
      localStorage.removeItem('referral_code');
      console.error("[apiService.signInWithGoogle] Network/fetch error, removed pending code.");
      return { success: false, message: error.message || 'A network error occurred.' };
    }
  }


  async getCurrentUser(): Promise<{ success: boolean; data: User | null }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      
      if (result.data) {
        localStorage.setItem('user_data', JSON.stringify(result.data));
      }

      return result;
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: true, data: null };
    }
  }

  async signOut(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/signout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('studio_status');
  }


  async getHairstyleCategories(): Promise<{ success: boolean; data: { name: string, count: number }[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/hairstyles/meta/categories`);
      const result = await response.json();
      return { success: result.status === 'success', data: result.data.categories || [] };
    } catch (error) {
      console.error('Get hairstyle categories error:', error);
      return { success: false, data: [] };
    }
  }

  // Hairstyles
 async getHairstyles(filters?: { 
    category?: string; 
    gender?: string; 
    search?: string; 
    sort?: string; 
    page?: number;   // 👈 ADDED page
    limit?: number; // 👈 ADDED limit
    feature?: string; 
    type?: 'default' | 'custom';
  }): Promise<HairstyleListResponse> { // 👈 CHANGED return type
    try {
      const params = new URLSearchParams();
      
      if (filters?.category && filters.category !== 'All') {
        params.append('category', filters.category);
      }
      
      if (filters?.gender && filters.gender !== 'All') {
        params.append('gender', filters.gender);
      }  
      if (filters?.feature && filters.feature !== 'All') {
        params.append('feature', filters.feature);
      } 
      if (filters?.sort && filters.sort !== 'All') {
        params.append('sort', filters.sort);
      }
      
      if (filters?.search) {
        params.append('search', filters.search);
      }

        if (filters?.type) {
        params.append('type', filters.type);
      }

      // 👈 ADDED pagination parameters
      if (filters?.page) {
        params.append('page', String(filters.page));
      }
      if (filters?.limit) {
        params.append('limit', String(filters.limit));
      }


      const response = await fetch(`${API_BASE_URL}/hairstyles?${params}`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Get hairstyles error:', error);
      // Return a default, correctly structured error object
      return { 
        status: 'error', 
        results: 0, 
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
        data: { hairstyles: [] } 
      };
    }
  }

  async getHairstyle(id: string): Promise<{ success: boolean; data: Hairstyle }> {
    try {
      const response = await fetch(`${API_BASE_URL}/hairstyles/${id}`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Get hairstyle error:', error);
      return { success: false, data: {} as Hairstyle };
    }
  }

  // Generations
  async generateHairstyle(hairstyleId: string,mimeType: string, imageFile: File): Promise<{ success: boolean; data: { generationId: string; status: string } }> {
    try {
      const formData = new FormData();
      formData.append('hairstyleId', hairstyleId);
      formData.append('mimeType', mimeType);
      formData.append('image', imageFile);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/generations/generate`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });

      return await response.json();
    } catch (error) {
      console.error('Generate hairstyle error:', error);
      return { success: false, data: { generationId: '', status: 'failed' } };
    }
  }

async analyzeHairstyleImage(imageFile: File,imageMimeType:any,selectedPhoto:any): Promise<HairstyleAnalysisResponse> {
    const formData = new FormData();

 
formData.append('hairstyleImage', imageFile, 'custom_style.jpg'); 
    formData.append('userPhoto', selectedPhoto, 'user_headshot.jpg');

    
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE_URL}/generations/analyze-hairstyle`, {
      method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });

      return await response.json();
      
    } catch (error: any) {
      console.error('Hairstyle analysis network error:', error);
      return { 
          success: false, 
          ai_description: '', 
          message: error.message || 'A network error occurred.' 
      };
    }
  }


  async getGenerationStatus(generationId: string): Promise<{ success: boolean; data: Generation }> {
    try {
      const response = await fetch(`${API_BASE_URL}/generations/${generationId}/status`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Get generation status error:', error);
      return { success: false, data: {} as Generation };
    }
  }

  async getGenerationHistory(): Promise<{ success: boolean; data: Generation[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/generations/history`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Get generation history error:', error);
      return { success: false, data: [] };
    }
  }

  // Payments
  async initializePayment(type: 'credit_pack' | 'subscription', planId: string): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/initialize`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ type, planId })
      });

      return await response.json();
    } catch (error) {
      console.error('Initialize payment error:', error);
      return { success: false, data: null };
    }
  }

  async verifyPayment(reference: string): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/verify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reference })
      });

      return await response.json();
    } catch (error) {
      console.error('Verify payment error:', error);
      return { success: false, data: null };
    }
  }
  

   async grantFreeCredit(): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reward_ad`, {
          method: 'POST',
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Get generation status error:', error);
      return { success: false, data: {} as Generation };
    }
  }

async getReferralInfo(): Promise<{ success: boolean; data: { referralCode: string; referralCount: number; creditsEarned: number } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/referral-info`, {
        headers: this.getAuthHeaders()
      });
      const result = await response.json();
      if (result.status === 'success') {
        return { success: true, data: result.data };
      }
      return { success: false, data: { referralCode: '', referralCount: 0, creditsEarned: 0 } };
    } catch (error) {
      console.error('Get referral info error:', error);
      return { success: false, data: { referralCode: '', referralCount: 0, creditsEarned: 0 } };
    }
  }


  async updateDeviceToken(deviceToken:any): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-device-token`, {
          method: 'POST',
        headers: this.getAuthHeaders(),
        body:JSON.stringify(deviceToken)
      });
       return await response.json();
    } catch (error) {
      console.error('updateDeviceToken:', error);
      return { success: false, data: null };
    }
  }


  async deleteAccount(): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/account/delete`, {
          method: 'DELETE',
        headers: this.getAuthHeaders()
      });
       return await response.json();
    } catch (error) {
      console.error('deleteAccount:', error);
      return { success: false, data: null };
    }
  }


  async getPaymentHistory(): Promise<{ success: boolean; data: any[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/history`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Get payment history error:', error);
      return { success: false, data: [] };
    }
  }

  async getPricingPlans(): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/plans`);
      return await response.json();
    } catch (error) {
      console.error('Get pricing plans error:', error);
      return { success: false, data: { creditPacks: [], subscriptions: [] } };
    }
  }

  // Analytics
  async trackEvent(eventName: string, eventData: Record<string, any>): Promise<void> {
    try {
      // await fetch(`${API_BASE_URL}/analytics/track`, {
      //   method: 'POST',
      //   headers: this.getAuthHeaders(),
      //   body: JSON.stringify({
      //     eventName,
      //     eventData,
      //     sessionId: sessionStorage.getItem('session_id') || Math.random().toString(36)
      //   })
      // });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  async getAnalyticsDashboard(period: string = '30'): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/dashboard?period=${period}`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Get analytics dashboard error:', error);
      return { success: false, data: null };
    }
  }

  async getActivityTimeline(page: number = 1): Promise<{ success: boolean; data: any[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/timeline?page=${page}`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Get activity timeline error:', error);
      return { success: false, data: [] };
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      return { status: 'error', timestamp: new Date().toISOString() };
    }
  }

  async createAnimatedShareable(
    imageUrl: string,
    artistName: string
  ): Promise<{ success: boolean; animatedFileUrl?: string; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/watermark/create-premium`, { // 👈 NEW ROUTE
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ imageUrl, artistName })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        return { success: true, animatedFileUrl: result.data.animatedFileUrl };
      } else {
        return { success: false, message: result.message || 'Failed to create animated file.' };
      }
    } catch (error: any) {
      console.error('Create animated shareable error:', error);
      return { success: false, message: error.message || 'A network error occurred.' };
    }
  }



 


  
}



 



export const apiService = new ApiService();

// Backward compatibility exports
export const signInWithGoogle = (data: any) => apiService.signInWithGoogle(data);
export const getCurrentUser = () => apiService.getCurrentUser();
export const signOut = () => apiService.signOut();
export const getHairstyles = (filters?: any) => apiService.getHairstyles(filters);
export const generateHairstyle = (hairstyleId: string, imageFile: File) => apiService.generateHairstyle(hairstyleId, imageFile);
export const trackEvent = (eventName: string, properties: Record<string, any>) => apiService.trackEvent(eventName, properties);