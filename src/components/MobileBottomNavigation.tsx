import React from 'react';
import { History, Wand2, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MobileShellTab } from '@/hooks/useStudioPageLogic';

interface MobileBottomNavigationProps {
  activeTab: MobileShellTab;
  onNavigate: (tab: MobileShellTab) => void;
}

const items: Array<{
  id: MobileShellTab;
  label: string;
  icon: React.ElementType;
}> = [
  { id: 'try-on', label: 'Try On', icon: Wand2 },
  { id: 'looks', label: 'Looks', icon: History },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

export default function MobileBottomNavigation({ activeTab, onNavigate }: MobileBottomNavigationProps) {
  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
    >
      {/* Frosted glass bar */}
      <div className="border-t border-black/[0.06] bg-white">
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 h-[var(--mobile-tabbar-height)] pb-[var(--safe-area-bottom,0px)]">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex flex-1 flex-col items-center pt-2.5 pb-1.5 gap-1',
                  'transition-colors duration-150 ease-out',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-0 rounded-lg',
                  isActive ? 'text-[#1a1a1a]' : 'text-[#999] active:text-[#666]'
                )}
              >
                {/* Top accent bar — spans full tab width */}
                <span
                  className={cn(
                    'absolute -top-[0.5px] left-0 right-0 h-[2.5px] rounded-full transition-all duration-200 ease-out',
                    isActive ? 'bg-[#1a1a1a]' : 'bg-transparent'
                  )}
                />
                <Icon
                  className={cn(
                    'h-6 w-6 transition-transform duration-150',
                    isActive ? 'stroke-[2.2]' : 'stroke-[1.6]'
                  )}
                />
                <span
                  className={cn(
                    'text-[11px] leading-tight transition-colors duration-150',
                    isActive ? 'font-semibold' : 'font-medium'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}