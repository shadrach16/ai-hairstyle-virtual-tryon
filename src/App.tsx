// src/App.tsx

import React, { useEffect, useRef } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Index from './pages/Index';
import Analytics from './pages/Analytics';
import LandingPage from './components/LandingPage';
import NotFound from './pages/NotFound';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';
import AuthCallback from '@/components/AuthCallback';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Filesystem } from '@capacitor/filesystem';
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';

console.log('[App Init] Top-level script execution start.');

const queryClient = new QueryClient();

let hasInitialized = false;
console.log(`[App Init] Initial hasInitialized: ${hasInitialized}`);

const setStatusBarAppearance = async () => {
  console.log('[App Init] Setting Status Bar Appearance...');
  if (!Capacitor.isNativePlatform()) {
      console.log('[App Init] Not native platform, skipping status bar setup.');
      return;
  }
  try {
    await StatusBar.show();
    await StatusBar.setBackgroundColor({ color: '#d97706' });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setOverlaysWebView({ overlay: false });
    console.log('[App Init] Status Bar appearance set.');
  } catch (e) {
      console.error("[App Init] Error setting status bar:", e);
  }
};

const checkAndRequestStoragePermission = async () => {
  console.log('[App Init] Checking storage permission...');
  if (Capacitor.getPlatform() !== 'android') {
      console.log('[App Init] Not Android, skipping storage permission check.');
      return true;
  }
  try {
    let status = await Filesystem.checkPermissions();
    console.log(`[App Init] Initial storage permission status: ${status.publicStorage}`);
    if (status.publicStorage !== 'granted') {
      console.log('[App Init] Requesting storage permission...');
      status = await Filesystem.requestPermissions();
      console.log(`[App Init] Storage permission result: ${status.publicStorage}`);
      return status.publicStorage === 'granted';
    }
    console.log('[App Init] Storage permission already granted.');
    return true;
  } catch (e) {
    console.error('[App Init] Error checking/requesting storage permissions:', e);
    return false;
  }
};

// Run initialization only once
if (!hasInitialized && Capacitor.isNativePlatform()) {
    console.log("[App Init] Running one-time native initialization...");
    if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        console.log("[App Init] Initializing SocialLogin...");
        SocialLogin.initialize({
             google: {
               webClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
             }
        })
        .then(() => console.log("[App Init] SocialLogin initialized successfully."))
        .catch(e => console.error("[App Init] SocialLogin Init Error:", e));
    } else {
        console.warn("[App Init] VITE_GOOGLE_CLIENT_ID not found, SocialLogin not initialized.");
    }
    setStatusBarAppearance();
    checkAndRequestStoragePermission();
    hasInitialized = true;
    console.log(`[App Init] Native initialization complete. hasInitialized: ${hasInitialized}`);
} else {
    console.log(`[App Init] Skipping native initialization (hasInitialized: ${hasInitialized}, isNative: ${Capacitor.isNativePlatform()})`);
}

// --- AppRoutes Component ---
const AppRoutes = () => {
  console.log('[AppRoutes] Component rendering...');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const appUrlListenerRef = useRef<any>(null);
  const hasProcessedInitialUrl = useRef(false);
  
  console.log(`[AppRoutes] isAuthenticated: ${isAuthenticated}`);

  useEffect(() => {
    console.log('[AppRoutes Effect] Running effect for referral/deep link capture...');

    // Stores referral code if found and user isn't logged in
    const storeReferralCode = (code: string | null | undefined, source: string) => {
      console.log(`[Referral] storeReferralCode called with code: '${code}' from ${source}. isAuthenticated: ${isAuthenticated}`);
      
      if (!code) {
        console.log(`[Referral] No code provided from ${source}.`);
        return;
      }

      // Trim and validate code
      const trimmedCode = code.trim();
      if (!trimmedCode) {
        console.log(`[Referral] Empty code after trimming from ${source}.`);
        return;
      }

      if (isAuthenticated) {
        console.log(`[Referral] Code '${trimmedCode}' detected, but user is already authenticated. Ignoring.`);
        return;
      }

      const existingCode = localStorage.getItem('referral_code');
      if (existingCode) {
        console.log(`[Referral] Code '${trimmedCode}' detected, but referral_code already exists in localStorage ('${existingCode}'). Ignoring.`);
        return;
      }

      localStorage.setItem('referral_code', trimmedCode);
      console.log(`[Referral] Code '${trimmedCode}' stored in localStorage from ${source}.`);
    };

    // Function to parse referrer string (handles various formats)
    const parseReferrerCode = (referrerUrl: string): string | null => {
      if (!referrerUrl) return null;

      try {
        // Try parsing as URL search params first
        const searchStr = referrerUrl.startsWith('?') ? referrerUrl : `?${referrerUrl}`;
        const params = new URLSearchParams(searchStr);
        const refFromParams = params.get('ref');
        
        if (refFromParams) {
          console.log(`[Referrer Parser] Found ref in params: '${refFromParams}'`);
          return refFromParams;
        }

        // Check if it's a URL-encoded ref parameter
        const decodedUrl = decodeURIComponent(referrerUrl);
        const decodedParams = new URLSearchParams(decodedUrl.startsWith('?') ? decodedUrl : `?${decodedUrl}`);
        const refFromDecoded = decodedParams.get('ref');
        
        if (refFromDecoded) {
          console.log(`[Referrer Parser] Found ref in decoded params: '${refFromDecoded}'`);
          return refFromDecoded;
        }

        // If no = or %3D found, treat entire string as referral code
        if (!referrerUrl.includes('=') && !referrerUrl.includes('%3D')) {
          console.log(`[Referrer Parser] Treating entire string as code: '${referrerUrl}'`);
          return referrerUrl;
        }

        console.log(`[Referrer Parser] Could not parse referrer: '${referrerUrl}'`);
        return null;
      } catch (e) {
        console.error(`[Referrer Parser] Error parsing referrer '${referrerUrl}':`, e);
        return null;
      }
    };

    // Function to handle deep link URL processing
    const handleAppLink = (urlString: string, source: string) => {
      console.log(`[DeepLink] handleAppLink called from ${source}. URL: ${urlString}`);
      
      if (!urlString) {
        console.log(`[DeepLink] Empty URL from ${source}`);
        return;
      }

      try {
        const url = new URL(urlString);
        const refCode = url.searchParams.get('ref');
        console.log(`[DeepLink] Parsed refCode from URL: '${refCode}'`);
        storeReferralCode(refCode, `${source} URL`);

        // Optional: Deep Link Routing
        const path = url.pathname;
        console.log(`[DeepLink] URL Pathname: '${path}'`);
        
        if (path === '/profile') {
          console.log('[DeepLink] Navigating to /profile');
          navigate('/profile');
        } else if (path.startsWith('/product/')) {
          const productId = path.split('/')[2];
          console.log(`[DeepLink] Navigating to /product/${productId}`);
          navigate(`/product/${productId}`);
        } else if (path && path !== '/' && path !== '/download') {
          // Navigate to any other valid path
          console.log(`[DeepLink] Navigating to custom path: ${path}`);
          navigate(path);
        }
      } catch (e) {
        console.error(`[DeepLink] Error parsing URL from ${source}:`, e);
      }
    };

    if (Capacitor.isNativePlatform()) {
      console.log('[AppRoutes Effect] Native platform detected.');
      const platform = Capacitor.getPlatform();
      console.log(`[AppRoutes Effect] Platform: ${platform}`);

      // A) For NEW USERS (Deferred Deep Link) - Android Only
      if (platform === 'android') {
        console.log('[AppRoutes Effect] Checking Install Referrer...');
      
      }

      // B) Listen for deep links when app is already running (hot start)
      console.log('[AppRoutes Effect] Adding app URL listener...');
      const urlListener = CapacitorApp.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        console.log('[AppUrlOpen] App opened with URL:', event.url);
        handleAppLink(event.url, 'appUrlOpen listener');
      });
      
      appUrlListenerRef.current = urlListener;
      console.log('[AppRoutes Effect] App URL listener added.');

      // C) Check initial URL for cold starts via deep link
      if (!hasProcessedInitialUrl.current) {
        console.log('[AppRoutes Effect] Getting launch URL (one-time)...');
        CapacitorApp.getLaunchUrl()
          .then(launchUrl => {
            console.log('[AppRoutes Effect] Launch URL result:', launchUrl);
            if (launchUrl && launchUrl.url) {
              console.log('[AppRoutes Effect] App launched with URL:', launchUrl.url);
              handleAppLink(launchUrl.url, 'getLaunchUrl');
              hasProcessedInitialUrl.current = true;
            } else {
              console.log('[AppRoutes Effect] App not launched with a URL.');
            }
          })
          .catch(e => console.error("[AppRoutes Effect] Error getting launch URL:", e));
      }

    } else {
      // --- WEB BROWSER LOGIC ---
      console.log('[AppRoutes Effect] Web platform detected. Checking URL params...');
      try {
        const currentUrl = new URL(window.location.href);
        const refCode = currentUrl.searchParams.get('ref');
        console.log(`[AppRoutes Effect] Web URL refCode: '${refCode}'`);
        
        if (refCode) {
          storeReferralCode(refCode, 'Web URL');
          console.log('[AppRoutes Effect] Cleaning refCode from web URL.');
          // Clean URL without reloading page
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete('ref');
          window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search);
        } else {
          console.log('[AppRoutes Effect] No refCode found in web URL.');
        }
      } catch (e) {
        console.error('[AppRoutes Effect] Error parsing web URL:', e);
      }
    }

    // Cleanup listener when component unmounts
    return () => {
      console.log('[AppRoutes Effect] Cleaning up effect...');
      if (appUrlListenerRef.current) {
        console.log('[AppRoutes Effect] Removing app URL listener...');
        appUrlListenerRef.current.remove();
        appUrlListenerRef.current = null;
      }
    };

  }, [isAuthenticated, navigate]);

  console.log('[AppRoutes] Rendering Routes...');
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/download" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  console.log('[App] Rendering main App component...');
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster position="top-center" richColors  expand={true}    closeButton  />
          <BrowserRouter>
            {console.log('[App] Rendering AppRoutes inside BrowserRouter...')}
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

console.log('[App Init] Top-level script execution end.');
export default App;