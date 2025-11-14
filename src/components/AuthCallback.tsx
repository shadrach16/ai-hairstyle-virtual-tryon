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
       <div className="flex items-center justify-center h-screen flex-col space-y-5">
 
      <div className="text-center">
        <p className="text-lg font-semibold">Signing in with Google...</p>
        <p className="text-gray-600">Please wait, we're verifying your session.</p>
      </div>
    </div>
  );
}