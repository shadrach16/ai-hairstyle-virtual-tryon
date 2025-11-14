import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hairstudio.app',
  appName: 'Hair Studio',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  // Add the Android version block to set the SDK versions
  android: {
    // Minimum version required is 34 to satisfy your latest dependencies
    compileSdkVersion: 34, 
    targetSdkVersion: 34
  },
   assets: {
    icon: {
      source: 'app-icon.png' 
    },
    splash: {
      backgroundColor: '#16a34a', // Example: Dark purple/indigo background
    }
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Calendar: {
      permissions: ['calendar']
    },
    Filesystem: {
      permissions: ['storage']
    },
      CordovaPurchase: {
      log: 'DEBUG'
      },
      "StatusBar": {
      "overlaysWebView": false,
      "style": "DARK",
      "backgroundColor": "#d97706"
    },
      "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
 
  }
};

export default config;

