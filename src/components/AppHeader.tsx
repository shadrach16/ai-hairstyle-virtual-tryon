// src/components/AppHeader.jsx

import React from 'react';
import { Crown, LogOut, ChevronDown, Menu,Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
         DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Capacitor } from '@capacitor/core';

// Assuming these are imported correctly from your project structure:
import MobileSidebar from '@/components/Sidebar';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useAuth } from '@/hooks/useAuth'; 
import { PricingButton } from '@/components/PricingButton';


// Assuming the following functions/states are passed as props:
// handleSignOutWithHaptic, setShowPricing, onNavigate

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
    handleDeleteAccount,
    onNavigate,
}) => {
    
    // --- User Dropdown Content (Right Side) ---
    const UserDropdownContent = (
        <DropdownMenuContent className="w-60" align="end">
            {/* Section 1: User Info */}
            <DropdownMenuLabel>
                <div className="flex flex-row space-y-1 space-x-2 justify-center">
                    {user?.avatar && (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-slate-200"
                        />
                    )}
                    <div className='flex flex-col space-y-1'>
                        <p className="font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                    </div>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Section 2: Account Status */}
            <div className="px-2 py-1.5">
                {user?.isPro ? (
                    <Badge className="w-full justify-center
                    bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-none py-1.5">
                        <Crown className="w-3 h-3 mr-1.5" />
                        Premium Member
                    </Badge>
                ) : (
                    <div className="flex justify-between items-center px-1">
                        <span className="text-sm text-slate-600">Total Credits</span>
                        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                            {Number(user?.credits).toFixed(2) || 0}
                        </Badge>
                    </div>
                )}
            </div>
            <DropdownMenuSeparator />
            
            {/* Section 3: Actions */}
            <DropdownMenuItem onClick={() => setShowPricing(true)} className="cursor-pointer">
                <Crown className="mr-2 h-4 w-4 text-red-500" />
                <span className='text-red-500 font-medium'>{user?.isPro ? 'Manage Subscription' : 'Get More Credits'}</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Section 4: Sign Out */}
            <DropdownMenuItem onClick={handleSignOutWithHaptic}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    );

    // --- Main Header Structure ---
    return (
        <header className="bg-white  border-b border-gray-200 px-3 py-3 flex items-center justify-between z-50 safe-p-t">
            {/* LEFT SIDE: Sidebar Menu and Branding */}
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 sm:mx-3">
                    
                    {/* MOBILE SIDEBAR TRIGGER (Hidden on desktop) */}
                    <div className="lg:hidden">
                        <MobileSidebar
                            user={user}
                            isAuthenticated={isAuthenticated}
                            setShowPricing={setShowPricing}
                            handleSignOutWithHaptic={handleSignOutWithHaptic}
                            handleDeleteAccount={handleDeleteAccount}
                            onNavigate={onNavigate}
                        />
                    </div>
                    
        

             <a href={Capacitor.isNativePlatform() ? '': '/'}  className="flex items-center space-x-2 ">
            <img className='hidden sm:block w-12 bg-red-600 my-0' src={'https://play-lh.googleusercontent.com/y0T4DaQxzB9aVyFGgkBiQ533Q-Ct4V3a6DaU4d20eAqHoXCuZUvOi9LmFk2MKCnfCNysTraKVJOW-MabI_QKVg=w240-h480-rw'} />
            <span className="text-2xl font-bold text-gray-900 truncate ">Hair Studio</span>
            <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-md hidden sm:block">TRY-ON</span>
          </a>

                </div>
            </div>
            
            {/* RIGHT SIDE: User Status and Actions */}
            <div className="flex items-center space-x-3">
                {isAuthenticated ? (
                    <>
                        {/* CREDITS & AVATAR DROPDOWN (Primary authenticated control) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 rounded-full sm:px-1 text-sm font-medium hover:bg-slate-100 focus:outline-none sm:bg-gray-200 sm:py-1 transition-colors">
                                    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                                        <Coins className="w-5 h-5 my-1 mr-2  text-amber" />  {Number(user?.credits).toFixed(2) || 0} Credits
                                    </Badge>
                                    {user?.avatar && (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-slate-200 hidden sm:block"
                                        />
                                    )}
                                    <span className="hidden sm:inline text-slate-700 title">{user?.name}</span>
                                    <ChevronDown className="hidden sm:inline w-4 h-4 text-slate-500" />
                                </button>
                            </DropdownMenuTrigger>
                            {UserDropdownContent}
                        </DropdownMenu>
                        
                    </>
                ) : (
                    /* GUEST/SIGN IN BUTTON */
                    <GoogleSignInButton
                        variant="outline"
                        size="sm"
                        className="text-xs border-amber-200 hover:bg-amber-50 py-2 sm:py-2.5 px-3 sm:px-4"
                    />
                )}
                
                {/* DESKTOP ONLY: Get Credits Button */}


               <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPricing(true)}
                    className="hidden lg:flex hover:bg-red-300 bg-red-500 text-xs text-white"
                >
                    <Crown className="w-3 h-3 mr-1" />
                    Get More Credits
                </Button>
            </div>
        </header>
    );
};

export default AppHeader;