import { apiService, type User } from './apiService';

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export class AuthService {
  private static instance: AuthService;
  private user: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize Google Sign-In
  async initializeGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load Google Identity Services
      if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
          // Use fallback client ID for demo purposes
          const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID || 'mock-client-id';
          
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: this.handleGoogleResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  // Handle Google Sign-In response
  private async handleGoogleResponse(response: any): Promise<void> {
    try {
      const result = await apiService.signInWithGoogle(response.credential);
      
      if (result.success) {
        this.user = result.data;
        this.notifyListeners();
        
        // Track sign-in event
        await apiService.trackEvent('user_signed_in', {
          method: 'google',
          user_id: result.data.id
        });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  }

  // Sign in with Google (trigger the popup)
  async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      if (typeof window !== 'undefined' && window.google) {
        // For demo purposes, we'll simulate the Google sign-in
        const mockCredential = 'mock-google-jwt-token';
        const result = await apiService.signInWithGoogle(mockCredential);
        
        if (result.success) {
          this.user = result.data;
          this.notifyListeners();
          return { success: true, user: result.data };
        }
      }
      
      return { success: false, error: 'Google sign-in not available' };
    } catch (error) {
      return { success: false, error: 'Sign-in failed' };
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await apiService.signOut();
      this.user = null;
      this.notifyListeners();
      
      // Sign out from Google
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.user !== null;
  }

  // Check if user is pro
  isPro(): boolean {
    return this.user?.isPro || false;
  }

  // Load user from storage on app start
  async loadUser(): Promise<void> {
    try {
      const result = await apiService.getCurrentUser();
      if (result.success && result.data) {
        this.user = result.data;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of auth state change
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.user));
  }

  // Update user data (CRITICAL: This refreshes the header)
  async updateUser(updates?: Partial<User>): Promise<void> {
    try {
      // Reload user from API to get latest data
      const result = await apiService.getCurrentUser();
      if (result.success && result.data) {
        this.user = result.data;
        
        // Apply any additional updates
        if (updates) {
          this.user = { ...this.user, ...updates };
          localStorage.setItem('user_data', JSON.stringify(this.user));
        }
        
        // Notify all components (including header) of the change
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  // Refresh user data from API
  async refreshUser(): Promise<void> {
    await this.updateUser();
  }
}

export const authService = AuthService.getInstance();