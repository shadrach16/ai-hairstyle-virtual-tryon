import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hairstudio.app',
  appName: 'Hair Studio',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
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
      backgroundColor: '#ffffff',
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
      "style": "LIGHT",
      "backgroundColor": "#ffffff"
    },
      "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
 
  }
};

export default config;

