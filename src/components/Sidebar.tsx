// src/components/MobileSidebar.jsx

import React, { useState } from 'react';
import { LogOut, Crown, BarChart3, Mail, Menu, X, UserRound, Home, ChevronRight, Phone, Trash2, HelpCircle, LogIn } from 'lucide-react'; // Added Phone icon (optional)
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

// Capacitor Haptics Utility
const triggerHapticFeedback = (style: ImpactStyle) => {
 
};

const UserAvatar = ({ user }) => {
    const isGuest = user?.isGuest;
    // Handle null/undefined user or guest user
    if (!user || isGuest) {
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-dashed border-gray-400">
                <UserRound className="w-5 h-5 text-gray-500" />
            </div>
        );
    }
    return (
        <img
            src={user.avatar || 'placeholder-url'}
            alt={user.name || 'User'}
            className="w-10 h-10 rounded-full border-2 border-slate-200 object-cover"
        />
    );
};

const MobileSidebar = ({ user, isAuthenticated, setShowPricing, handleSignOutWithHaptic, onNavigate, handleDeleteAccount, onShowHelp, onShowAuth }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isGuest = user?.isGuest;

    const toggleSidebar = () => {
        triggerHapticFeedback('small');
        setIsOpen(prev => !prev);
    };

    const handleNavigation = (page) => {
        setIsOpen(false); // Close the drawer upon navigation
        onNavigate(page);
    };
    
    const UserInfoSection = (
        <div className="p-4 safe-p-t bg-amber-50 border-b">
            <div className="flex items-center space-x-3">
                {user?.avatar && !isGuest ? <UserAvatar user={user} /> : <UserAvatar user={user} />}
                <div className='flex flex-col'>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold leading-none text-slate-800">
                            {isAuthenticated ? (isGuest ? 'Guest' : user?.name) : 'Guest User'}
                        </p>
                        {isGuest && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">
                                Trial
                            </span>
                        )}
                    </div>
                    <p className="text-xs leading-none text-slate-500 mt-1">
                        {isAuthenticated && !isGuest ? user?.email : 'Sign in for full access'}
                    </p>
                </div>
            </div>
            
            <Separator className="my-3 bg-amber-200"/>
            
            {/* Guest sign-in CTA or Credits/Pricing Button */}
            {isGuest ? (
                <Button 
                    onClick={() => { setIsOpen(false); onShowAuth?.(); }} 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold h-9"
                >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign in for 5 free credits
                </Button>
            ) : (
                <Button 
                    onClick={() => { setIsOpen(false); setShowPricing(true); }} 
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold h-9"
                >
                    <Crown className="w-4 h-4 mr-2" />
                    {user?.isPro ? 'Manage Subscription' : `Credits: ${Number(user?.credits).toFixed(2) || 0}`}
                </Button>
            )}

        </div>
    );

    return (
        <>
            {/* 1. MENU BUTTON (The Trigger) */}
            <button 
                className=" mr-2 rounded-full text-sm font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors lg:hidden z-[100]"
                onClick={toggleSidebar}
            >
                <Menu className='w-6 h-6 text-slate-700' />
            </button>

            {/* 2. OVERLAY (Click outside to close) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            {/* 3. SIDEBAR DRAWER (The Content) */}
            <div 
                className={`
                    fixed top-0 left-0 h-screen z-50 overflow-y-auto bg-white shadow-2xl transition-transform duration-300
                    w-3/4 sm:w-[60%] max-w-sm 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Close Button & Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    {/* Placeholder for optional logo/name inside the drawer header */}
                     <a  className="text-lg font-bold
bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text
text-transparent fascinate-inline-regular">
                Hair Studio
              </a>
                    <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* USER PROFILE & CREDITS */}
                {UserInfoSection}

                {/* NAVIGATION */}
                <div className="py-2 flex flex-col justify-between h-[calc(100vh-200px)]">
                    <nav className="flex-1">
                       
                        {onShowHelp && (
                            <SidebarLink 
                                icon={HelpCircle} 
                                label="Help & Guide" 
                                onClick={() => { setIsOpen(false); onShowHelp(); }} 
                            />
                        )}
                        
                        <SidebarLink 
                            icon={Mail} 
                            label="Contact Support" 
                            onClick={() => { setIsOpen(false); window.location.href = 'mailto:admin@campusprint.com.ng'; }} 
                            isAction={true}
                        />

                        <Separator className="my-3"/>
                      

                      
                    </nav>
                    
                    {/* 💡 FOOTER SECTION (Contact and Copyright) */}
                    <div className="flex flex-col ">
                         {/* 💡 SIGN OUT LINK (Moved up for better access) */}
                        {isAuthenticated && (
                          <Button 
              onClick={handleSignOutWithHaptic} 
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold h-9 rounded-none"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
            </Button>

           )}


                        {isAuthenticated && (
                            <SidebarLink 
                                icon={Trash2} 
                                label="Delete Account" 
                                onClick={() => { setIsOpen(false); handleDeleteAccount(); }} // Call the handler
                                isSignOut={true} // Use the red style
                            />
                        )}
                        <Separator className="my-1"/>
                        
                        <div className="p-4 text-center text-xs text-slate-400 safe-p-b">
                            © {new Date().getFullYear()} Hair Studio. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Helper component for navigation links
const SidebarLink = ({ icon: Icon, label, onClick, isSignOut = false, isAction = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-left transition-colors hover:bg-slate-100 
                   ${isSignOut ? 'text-red-600 font-medium' : 'text-slate-700'}
                   ${isAction ? 'text-blue-600' : ''}
        `}
    >
        <Icon className={`w-5 h-5 mr-3 ${isSignOut ? 'text-red-500' : 'text-amber-600'}`} />
        <span className="text-base flex-1">{label}</span>
        {!isSignOut && !isAction && <ChevronRight className="w-4 h-4 text-slate-400"/>}
    </button>
);

export default MobileSidebar;