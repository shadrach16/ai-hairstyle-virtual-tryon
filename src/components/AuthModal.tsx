import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import GoogleSignInButton from './GoogleSignInButton';
import { Crown, Sparkles, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
  showProBenefits?: boolean;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Sign in to Continue",
  description = "Create your account to access premium hairstyles and features.",
  showProBenefits = false
}: AuthModalProps) {
  
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  React.useEffect(()=>{
 localStorage.setItem("studio_status",'upload')
},[])


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>

          {showProBenefits && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-6 border border-amber-200">
              <div className="flex items-center mb-3">
                <Crown className="w-5 h-5 text-amber-600 mr-2" />
                <h3 className="font-semibold text-amber-800">Pro Benefits</h3>
              </div>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Unlimited hairstyle generations</li>
                <li>• HD quality exports without watermarks</li>
                <li>• Priority processing & support</li>
                <li>• Access to premium hairstyles</li>
                <li>• Style history & favorites</li>
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <GoogleSignInButton 
              onSuccess={handleSuccess}
              className="w-full h-12 text-base font-semibold"
            />
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-amber-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
 
      </DialogContent>
    </Dialog>
  );
}