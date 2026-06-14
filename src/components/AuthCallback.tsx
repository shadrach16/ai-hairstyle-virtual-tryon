// src/components/AuthCallback.tsx (Updated)

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Helper function to decode the JWT payload
function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const queryParams = new URLSearchParams(window.location.search);
    const error = queryParams.get('error');
    
    if (error) {
      const errorDescription = queryParams.get('error_description') || 'The Google sign-in process was cancelled or failed.';
      toast.error('Sign-in Error', { description: errorDescription });
      navigate('/');
      return;
    }

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const credential = hashParams.get('id_token');

    if (credential) {
      // 👈 **DECODE THE TOKEN HERE**
      const decodedToken = decodeJwt(credential);

      if (!decodedToken) {
        toast.error('Sign-in Failed', { description: 'The received token was invalid.' });
        navigate('/');
        return;
      }
      
      // 👈 **PASS THE FULL DECODED INFO TO THE SIGNIN FUNCTION**
      const googleData = {
        credential,
        email: decodedToken.email,
        name: decodedToken.name,
        avatar: decodedToken.picture,
        sub: decodedToken.sub // The unique Google ID
      };

      signIn(googleData)
        .then(success => {
          if (success) {
            navigate('/?studio_status='+(localStorage.getItem("studio_status")||"upload") )
          } else {
            navigate('/');
          }
        });
    } else {
      toast.error('Sign-in Failed', { description: 'Could not find a valid Google credential in the URL.' });
      navigate('/');
    }

  }, [signIn, navigate]);


  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center gap-8 w-full max-w-[280px]">
        {/* Pulsing avatar skeleton */}
        <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />

        {/* Content skeleton lines */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="h-3 w-36 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-2.5 w-48 rounded-full bg-gray-50 animate-pulse [animation-delay:150ms]" />
        </div>

        {/* Minimal sliding progress bar */}
        <div className="w-full h-[3px] rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            style={{ animation: 'authSlide 1.4s ease-in-out infinite' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes authSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}