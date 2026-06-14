// src/components/AppHeader.tsx

import React from 'react';
import { LogOut, Coins, User as UserIcon, HelpCircle, Gift, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Capacitor } from '@capacitor/core';

import MobileSidebar from '@/components/Sidebar';
import GoogleSignInButton from '@/components/GoogleSignInButton';

interface AppHeaderProps {
  user: any;
  isAuthenticated: boolean;
  setShowPricing: (show: boolean) => void;
  setShowRewardsCenter?: (show: boolean) => void;
  handleSignOutWithHaptic: () => void;
  handleDeleteAccount: () => void;
  onNavigate: (page: string) => void;
  onShowHelp?: () => void;
  onShowAuth?: () => void;
  isMobileShellEnabled?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  isAuthenticated,
  setShowPricing,
  setShowRewardsCenter,
  handleSignOutWithHaptic,
  onNavigate,
  onShowHelp,
  onShowAuth,
  isMobileShellEnabled = false,
}) => {

  return (
    <header 
      aria-label="App header"
      className="sticky top-0 z-header w-full bg-white pt-safe-top border-b border-gray-100/80"
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-white focus:text-gray-900 focus:underline">Skip to main content</a>
      <div className="max-w-7xl mx-auto px-4 h-[56px] flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <div className="flex items-center gap-2">
          {!isMobileShellEnabled && (
            <div className="lg:hidden -ml-1.5">
              <MobileSidebar
                user={user}
                isAuthenticated={isAuthenticated}
                setShowPricing={setShowPricing}
                handleSignOutWithHaptic={handleSignOutWithHaptic}
                handleDeleteAccount={() => {}}
                onNavigate={onNavigate}
                onShowHelp={onShowHelp}
                onShowAuth={onShowAuth}
              />
            </div>
          )}
          <a 
            href={Capacitor.isNativePlatform() ? undefined : '/'} 
            className="flex items-center gap-2.5 group"
          >
            <img 
              className="w-9 h-9 rounded-full object-cover ring-1 ring-black/[0.06]" 
              src={'https://res.cloudinary.com/djpcokxvn/image/upload/v1777118970/HairStudio/app_logo_premium.png'} 
              alt="Hair Studio home"
            />
            <span className="text-[16px] font-bold text-gray-900 tracking-tight">
              Hair Studio
            </span>
          </a>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1.5">
          {isAuthenticated ? (
            <>
              {/* Credits pill */}
              <button 
                onClick={() => setShowPricing(true)}
                aria-label={`${Number(user?.credits).toFixed(0)} credits`}
                className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-gray-100 ring-1 ring-black/[0.04] active:scale-[0.97] transition-transform"
              >
                <Coins className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <span className="text-[13px] font-semibold text-gray-600 tabular-nums">
                  {Number(user?.credits).toFixed(0)}
                </span>
              </button>

              {/* User avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    aria-label={`${user?.name || 'User'} menu`}
                    className="flex items-center gap-1 h-9 pl-0.5 pr-1.5 rounded-full hover:bg-gray-50 active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-black/[0.06]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    )}
                    <ChevronDown className="w-3 h-3 text-gray-300" />
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-52 rounded-2xl p-1.5 shadow-lg shadow-gray-200/60 ring-1 ring-black/[0.04] border-0" align="end" sideOffset={6}>
                  <DropdownMenuLabel className="px-2.5 py-2">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="my-1 bg-gray-100" />
                  
                  <DropdownMenuItem 
                    onClick={() => setShowPricing(true)} 
                    className="cursor-pointer rounded-xl text-[13px] gap-2.5 py-2.5 px-2.5 focus:bg-gray-50"
                  >
                    <Coins className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-700">Get Credits</span>
                  </DropdownMenuItem>

                  {setShowRewardsCenter && (
                    <DropdownMenuItem 
                      onClick={() => setShowRewardsCenter(true)} 
                      className="cursor-pointer rounded-xl text-[13px] gap-2.5 py-2.5 px-2.5 focus:bg-gray-50"
                    >
                      <Gift className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-700">Earn Free Credits</span>
                    </DropdownMenuItem>
                  )}

                  {onShowHelp && (
                    <DropdownMenuItem 
                      onClick={onShowHelp} 
                      className="cursor-pointer rounded-xl text-[13px] gap-2.5 py-2.5 px-2.5 focus:bg-gray-50"
                    >
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-700">Help</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="my-1 bg-gray-100" />

                  <DropdownMenuItem 
                    onClick={handleSignOutWithHaptic} 
                    className="cursor-pointer rounded-xl text-[13px] gap-2.5 py-2.5 px-2.5 text-red-500 focus:text-red-500 focus:bg-red-50/60"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <GoogleSignInButton
              variant="outline"
              size="sm"
              className="h-8 px-3.5 text-[13px] rounded-full border-gray-200 hover:bg-gray-50 text-gray-700 font-medium shadow-none"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;