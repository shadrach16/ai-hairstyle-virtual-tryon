// Mock API service for backend integration
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

export interface PaymentRequest {
  userId: string;
  planId: string;
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

export interface HairstyleData {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  price: number;
  tags: string[];
  gender: 'male' | 'female' | 'unisex';
  description: string;
  culturalOrigin?: string;
  popularity: number;
  isNew?: boolean;
}

class ApiService {
  private baseUrl = 'https://api.africanhair.studio'; // Mock API base URL
  private mockDelay = 1000; // Simulate network delay

  // Simulate API delay
  private async delay(ms: number = this.mockDelay): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock successful response
  private mockResponse<T>(data: T, success: boolean = true): Promise<{ success: boolean; data: T; message?: string }> {
    return Promise.resolve({
      success,
      data,
      message: success ? 'Success' : 'Error occurred'
    });
  }

  // Authentication APIs
  async signInWithGoogle(googleToken: string): Promise<{ success: boolean; data: User; token: string }> {
    await this.delay(1500);
    
    // Mock Google sign-in response
    const mockUser: User = {
      id: 'user_' + Math.random().toString(36).substring(7),
      email: 'user@example.com',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isPro: false,
      credits: 5, // Free trial credits
      createdAt: new Date().toISOString()
    };

    const authToken = 'mock_jwt_token_' + Math.random().toString(36);
    
    // Store in localStorage for persistence
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));

    return {
      success: true,
      data: mockUser,
      token: authToken
    };
  }

  async signOut(): Promise<{ success: boolean }> {
    await this.delay(500);
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    return { success: true };
  }

  async getCurrentUser(): Promise<{ success: boolean; data: User | null }> {
    await this.delay(800);
    
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
      return { success: true, data: null };
    }

    const user = JSON.parse(userData) as User;
    return { success: true, data: user };
  }

  // Hairstyle APIs
  async getHairstyles(filters?: { category?: string; gender?: string; search?: string }): Promise<{ success: boolean; data: HairstyleData[] }> {
    await this.delay(1200);

    // Mock hairstyle data (expanded from existing)
    const mockHairstyles: HairstyleData[] = [
      {
        id: 'box-braids',
        name: 'Box Braids',
        category: 'Braids',
        thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&fit=crop',
        price: 1,
        tags: ['protective', 'long-lasting', 'versatile'],
        gender: 'female',
        description: 'Classic protective style with square-shaped parts',
        culturalOrigin: 'Ancient Egypt/West Africa',
        popularity: 95
      },
      {
        id: 'cornrows',
        name: 'Cornrows',
        category: 'Braids',
        thumbnail: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=300&fit=crop',
        price: 1,
        tags: ['traditional', 'protective', 'geometric'],
        gender: 'unisex',
        description: 'Traditional braided style close to the scalp',
        culturalOrigin: 'West Africa',
        popularity: 88
      },
      {
        id: 'afro-fade',
        name: 'Afro Fade',
        category: 'Modern',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        price: 1,
        tags: ['modern', 'clean', 'professional'],
        gender: 'male',
        description: 'Contemporary fade with natural afro texture',
        culturalOrigin: 'Modern African-American',
        popularity: 82,
        isNew: true
      }
    ];

    // Apply filters
    let filteredStyles = mockHairstyles;
    
    if (filters?.category && filters.category !== 'All') {
      filteredStyles = filteredStyles.filter(style => style.category === filters.category);
    }
    
    if (filters?.gender && filters.gender !== 'All') {
      filteredStyles = filteredStyles.filter(style => 
        style.gender === filters.gender.toLowerCase() || style.gender === 'unisex'
      );
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredStyles = filteredStyles.filter(style =>
        style.name.toLowerCase().includes(searchTerm) ||
        style.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        style.culturalOrigin?.toLowerCase().includes(searchTerm)
      );
    }

    return { success: true, data: filteredStyles };
  }

  // Payment APIs
  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
   alert('processing payetn dh')
  }

  // Credit Management APIs
  async useCredits(userId: string, amount: number): Promise<{ success: boolean; remainingCredits: number }> {
    await this.delay(500);

    const userData = localStorage.getItem('user_data');
    if (!userData) {
      return { success: false, remainingCredits: 0 };
    }

    const user = JSON.parse(userData) as User;
    
    if (user.credits >= amount) {
      user.credits -= amount;
      localStorage.setItem('user_data', JSON.stringify(user));
      return { success: true, remainingCredits: user.credits };
    }

    return { success: false, remainingCredits: user.credits };
  }

  async addCredits(userId: string, amount: number, source: string): Promise<{ success: boolean; newTotal: number }> {
    await this.delay(500);

    const userData = localStorage.getItem('user_data');
    if (!userData) {
      return { success: false, newTotal: 0 };
    }

    const user = JSON.parse(userData) as User;
    user.credits += amount;
    localStorage.setItem('user_data', JSON.stringify(user));

    return { success: true, newTotal: user.credits };
  }

  // AI Generation API
  async generateHairstyle(imageFile: File, hairstyleId: string, userId: string): Promise<{ success: boolean; imageUrl: string; creditsUsed: number }> {
    await this.delay(3000); // Simulate AI processing time

    // Mock generation - in reality, this would upload the image and process it
    const mockGeneratedUrl = 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop';
    
    return {
      success: true,
      imageUrl: mockGeneratedUrl,
      creditsUsed: 1
    };
  }

  // Analytics APIs
  async trackEvent(eventName: string, properties: Record<string, any>): Promise<{ success: boolean }> {
    await this.delay(200);
    
    console.log('Analytics Event:', eventName, properties);
    return { success: true };
  }
}

export const apiService = new ApiService();