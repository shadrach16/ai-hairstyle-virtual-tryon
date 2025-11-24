// src/components/AppHeader.jsx

import React from 'react';
import { Crown, LogOut, ChevronDown, Menu, Coins, User as UserIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Capacitor } from '@capacitor/core';

// Assuming these are imported correctly:
import MobileSidebar from '@/components/Sidebar';
import GoogleSignInButton from '@/components/GoogleSignInButton';

interface AppHeaderProps {
  user: any;
  isAuthenticated: boolean;
  setShowPricing: (show: boolean) => void;
  handleSignOutWithHaptic: () => void;
  handleDeleteAccount: () => void;
  onNavigate: (page: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  isAuthenticated,
  setShowPricing,
  handleSignOutWithHaptic,
  onNavigate,
}) => {
  
  // --- Internal Components for cleaner render ---

  const LogoSection = () => (
    <a 
      href={Capacitor.isNativePlatform() ? undefined : '/'} 
      className="flex items-center gap-3 group transition-opacity hover:opacity-90"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
        <img 
          className="relative w-10 h-10 rounded-full border border-slate-100 shadow-sm bg-white object-cover" 
          src={'https://res.cloudinary.com/djpcokxvn/image/upload/v1763046539/campusprint_kyc-documents/cropped_circle_image_1_ymbe1t.png'} 
          alt="Logo"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
          Hair Studio
        </span>
        {/* "Try-On" badge moved to subtitle for cleaner look */}
        <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600 flex items-center gap-1">
           Virtual Try-On <Sparkles className="w-3 h-3" />
        </span>
      </div>
    </a>
  );

  const UserProfileTrigger = () => (
    <button className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 bg-white shadow-sm group focus:ring-2 focus:ring-amber-500/20 focus:outline-none">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.avatar}
          className="w-8 h-8 rounded-full object-cover border border-slate-100"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <UserIcon className="w-4 h-4" />
        </div>
      )}
      
      <div className="flex flex-col items-start hidden sm:flex">
        <span className="text-xs font-semibold text-slate-700 leading-none max-w-[100px] truncate">
          {user?.name?.split(' ')[0]}
        </span>
        <span className="text-[10px] text-slate-500 leading-none mt-0.5">
          View Profile
        </span>
      </div>
      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors ml-1 hidden sm:block" />
    </button>
  );

  // --- Main Render ---

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/60 pt-[env(safe-area-inset-top)]"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT: Mobile Sidebar & Logo */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="lg:hidden -ml-2">
            <MobileSidebar
              user={user}
              isAuthenticated={isAuthenticated}
              setShowPricing={setShowPricing}
              handleSignOutWithHaptic={handleSignOutWithHaptic}
              handleDeleteAccount={() => {}} // Add handler if needed
              onNavigate={onNavigate}
            />
          </div>
          <LogoSection />
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {isAuthenticated ? (
            <>
              {/* Credits Display (Clickable) */}
              <div 
                onClick={() => setShowPricing(true)}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 hover:bg-amber-100/80 transition-colors"
              >
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold font-mono">
                  {Number(user?.credits).toFixed(0)}
                </span>
                <span className="text-xs font-medium text-amber-600/80">Credits</span>
              </div>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div><UserProfileTrigger /></div>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-64 p-2" align="end" sideOffset={8}>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  {/* Mobile Credit View inside dropdown (since it's hidden on navbar mobile) */}
                  <div className="sm:hidden p-2 bg-slate-50 rounded-md mb-2 border border-slate-100 flex justify-between items-center">
                     <span className="text-xs font-medium text-slate-600">Available Credits</span>
                     <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                        <Coins className="w-3 h-3" />
                        {Number(user?.credits).toFixed(0)}
                     </div>
                  </div>

                  <DropdownMenuItem 
                    onClick={() => setShowPricing(true)} 
                    className="cursor-pointer bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 focus:bg-amber-100 border border-amber-100 mb-1"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                    <span className="font-medium">Get More Credits</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleSignOutWithHaptic} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Desktop 'Get Credits' Button (Primary Call to Action) */}
              <Button
                size="sm"
                onClick={() => setShowPricing(true)}
                className="hidden lg:flex bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-200 rounded-full px-5"
              >
                <Crown className="w-3.5 h-3.5 mr-2 text-amber-400" />
                Get Premium
              </Button>
            </>
          ) : (
            /* Guest State */
            <div className="flex items-center gap-2">
               <span className="text-xs text-slate-500 font-medium hidden sm:block">
                  Save your styles?
               </span>
              <GoogleSignInButton
                variant="outline"
                size="sm"
                className="border-slate-200 hover:bg-slate-50 text-slate-700 font-medium shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;