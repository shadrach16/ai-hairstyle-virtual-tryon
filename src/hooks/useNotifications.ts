// src/hooks/useNotifications.ts
// Push notification permission and token management for Capacitor

import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { apiService } from '@/lib/api';

interface NotificationState {
  isSupported: boolean;
  isPermissionGranted: boolean;
  isLoading: boolean;
  deviceToken: string | null;
}

export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    isSupported: false,
    isPermissionGranted: false,
    isLoading: true,
    deviceToken: null
  });

  // Check if push notifications are supported
  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    setState(prev => ({ ...prev, isSupported: isNative }));
    
    if (isNative) {
      checkPermissionStatus();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Check current permission status
  const checkPermissionStatus = useCallback(async () => {
    try {
      const result = await PushNotifications.checkPermissions();
      const granted = result.receive === 'granted';
      
      setState(prev => ({
        ...prev,
        isPermissionGranted: granted,
        isLoading: false
      }));

      // If already granted, register for push
      if (granted) {
        await registerForPush();
      }
    } catch (error) {
      console.error('Failed to check notification permissions:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Request permission and register for push
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      console.log('Push notifications not supported on this platform');
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Request permission
      const result = await PushNotifications.requestPermissions();
      const granted = result.receive === 'granted';

      setState(prev => ({
        ...prev,
        isPermissionGranted: granted,
        isLoading: false
      }));

      if (granted) {
        await registerForPush();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, [state.isSupported]);

  // Register device and get token
  const registerForPush = useCallback(async () => {
    try {
      // Add listeners before registering
      await PushNotifications.addListener('registration', async (token) => {
        console.log('✅ Push registration success, token:', token.value);
        
        setState(prev => ({ ...prev, deviceToken: token.value }));

        // Send token to backend
        try {
          await apiService.registerDeviceToken(token.value, Capacitor.getPlatform());
        } catch (error) {
          console.error('Failed to register token with backend:', error);
        }
      });

      await PushNotifications.addListener('registrationError', (err) => {
        console.error('❌ Push registration error:', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('📬 Push received:', notification);
        // Handle foreground notification (could show in-app toast)
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('👆 Push action performed:', notification);
        // Handle notification tap - navigate to appropriate screen
        const data = notification.notification.data;
        if (data?.screen) {
          // You could use a router or event to navigate
          window.dispatchEvent(new CustomEvent('push-navigation', { detail: data }));
        }
      });

      // Register with APNs/FCM
      await PushNotifications.register();
    } catch (error) {
      console.error('Push registration failed:', error);
    }
  }, []);

  // Unregister from push notifications
  const unregister = useCallback(async () => {
    if (!state.isSupported) return;

    try {
      await PushNotifications.removeAllListeners();
      
      // Tell backend to remove token
      try {
        await apiService.unregisterDeviceToken();
      } catch (error) {
        console.error('Failed to unregister token from backend:', error);
      }

      setState(prev => ({ ...prev, deviceToken: null }));
    } catch (error) {
      console.error('Failed to unregister push notifications:', error);
    }
  }, [state.isSupported]);

  return {
    ...state,
    requestPermission,
    unregister,
    checkPermissionStatus
  };
}

export default useNotifications;
