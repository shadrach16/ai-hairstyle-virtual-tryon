import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, BarChart3, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import GoogleSignInButton from './GoogleSignInButton';
import { useAuth } from '@/hooks/useAuth';
import { handleSignOut } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentPage?: 'home' | 'blog' | 'analytics';
  onNavigate?: (page: 'home' | 'blog') => void;
  onGetStarted?: () => void;
}

const NavLink = ({ text, isActive, onClick }: { text: React.ReactNode, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'}`}
    >
        {text}
        {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-amber-600 rounded-full"></span>}
    </button>
);

const MobileNavLink = ({ text, onClick }: { text: React.ReactNode, onClick: () => void }) => (
    <button onClick={onClick} className="w-full text-left py-4 text-lg font-medium text-slate-700 hover:text-amber-600 transition-colors">
        {text}
    </button>
);

export default function Header({ currentPage = 'home', onNavigate, onGetStarted }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (page: 'home' | 'blog' | 'analytics') => {
    setMobileMenuOpen(false);
    if (page === 'analytics') {
      navigate('/analytics');
    } else if (onNavigate) {
      onNavigate(page);
    }
  };
  
  const UserMenu = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-full">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-slate-200 hover:border-amber-400 transition-colors"
                />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation('analytics')} className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Analytics</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('home')}>
              
                <div>
                    <h1 className="text-xl font-bold text-amber-600 logo">Hair Studio</h1>
                    <p className="text-xs text-slate-500 -mt-1">Try-On Studio</p>
                </div>
            </div>

         

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {user?.isPro ? (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-none px-3 py-1.5">
                      <Crown className="w-4 h-4 mr-1.5" /> Premium
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 px-3 py-1.5">
                       { Number(user?.credits).toFixed(2) || 0} credits
                    </Badge>
                  )}
                  <UserMenu />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <GoogleSignInButton variant="outline" size="sm" />
                  {onGetStarted && (
                    <Button
                      onClick={onGetStarted}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-5 h-10"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="md:hidden">
                <Button onClick={() => setMobileMenuOpen(true)} variant="ghost" size="icon">
                    <Menu className="w-6 h-6 text-slate-700" />
                </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 bg-white/80 backdrop-blur-xl transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-20 border-b border-slate-200">
                <div className="flex items-center gap-3" onClick={() => handleNavigation('home')}>
                    <div className="w-11 h-11  border border-gray-300  rounded-xl flex items-center justify-center">
                           <svg className="w-10 h-10  rounded-xl "   version="1.1" id="_x32_"   viewBox="0 0 512 512"  fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">   <g> <path class="st0" d="M221.982,283.066c-6.309,10.672-10.869,23.479-10.869,37.743c0,33.534,22.459,60.725,50.163,60.725 c27.705,0,49.512-20.462,50.832-55.444c0.514-13.673-2.64-29.051-10.715-41.738c-9.72-15.318-21.944-21.045-26.247-41.437 c-19.802-93.728-65.774-225.951-93.496-231.231c9.54,14.307,43.846,152.891,51.252,237.831 C234.514,268.065,228.942,271.305,221.982,283.066z"></path> <path class="st0" d="M297.27,186.853c-8.161,0-4.492,17.796,6.549,38.395c3.36,6.283,6.24,9.104,13.149,16.93 c4.218,4.8,9.49,10.783,14.461,18.601c11.503,18.104,17.367,40.632,16.51,63.416c-2.006,53.044-37.392,90.11-86.063,90.11 c-47.044,0-85.326-43.572-85.326-97.104c0-19.656,5.452-38.84,16.201-57.039c1.928-3.248,3.729-5.966,5.177-8.16 c1.106-1.672,2.777-4.192,3-4.843c0.009-0.009,1.466-4.586,3.574-9.421c10.295-23.538,8.829-50.884-19.124-50.884H0v313.463h512 V186.853H297.27z"></path> </g> </g></svg>

                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-amber-500 logo">Hair Studio</h1>
                    <p className="text-xs text-slate-500 -mt-1">Try-On Studio</p>
                    </div>
                </div>
                <Button onClick={() => setMobileMenuOpen(false)} variant="ghost" size="icon">
                    <X className="w-6 h-6 text-slate-700" />
                </Button>
            </div>
            <div className="divide-y divide-slate-200 mt-8">
                <MobileNavLink text="Home" onClick={() => handleNavigation('home')} />
                <MobileNavLink text="Blog" onClick={() => handleNavigation('blog')} />
                {isAuthenticated && (
                     <MobileNavLink 
                        text={<div className="flex items-center gap-3"><BarChart3 className="w-5 h-5" /> Analytics</div>} 
                        onClick={() => handleNavigation('analytics')} 
                    />
                )}
            </div>
            <div className="absolute bottom-10 left-4 right-4 flex flex-col gap-4">
                {isAuthenticated ? (
                    <Button onClick={handleSignOut} variant="outline" className="h-12 text-lg">Sign Out</Button>
                ) : (
                    <>
                        <GoogleSignInButton className="h-12"/>
                        {onGetStarted && <Button onClick={onGetStarted} className="h-12 bg-amber-600 hover:bg-amber-700 text-white text-lg">Get Started</Button>}
                    </>
                )}
            </div>
          </div>
      </div>
    </>
  );
}