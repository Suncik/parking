import React from 'react';
import { Map, CalendarPlus, History, User } from 'lucide-react';
import { MainTabType } from '../../types';

interface MobileBottomTabBarProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  hasActiveSession?: boolean;
}

export const MobileBottomTabBar: React.FC<MobileBottomTabBarProps> = ({
  activeTab,
  onTabChange,
  hasActiveSession = false,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] py-1 px-4">
      <div className="grid grid-cols-4 items-center h-14 max-w-md mx-auto">
        {/* Tab 1: Xarita */}
        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'map'
              ? 'text-[#2563EB]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Xarita"
        >
          <Map className="w-5 h-5" strokeWidth={activeTab === 'map' ? 2.4 : 1.8} />
          <span className="text-[11px] font-semibold mt-1 tracking-tight">
            Xarita
          </span>
        </button>

        {/* Tab 2: Band qilish */}
        <button
          onClick={() => onTabChange('booking')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'booking'
              ? 'text-[#2563EB]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Band qilish"
        >
          <CalendarPlus className="w-5 h-5" strokeWidth={activeTab === 'booking' ? 2.4 : 1.8} />
          <span className="text-[11px] font-semibold mt-1 tracking-tight">
            Band qilish
          </span>
        </button>

        {/* Tab 3: Tarix */}
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center justify-center min-h-[44px] relative transition-colors ${
            activeTab === 'history'
              ? 'text-[#2563EB]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Tarix"
        >
          <History className="w-5 h-5" strokeWidth={activeTab === 'history' ? 2.4 : 1.8} />
          {hasActiveSession && (
            <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-[#16A34A] ring-2 ring-white animate-pulse" />
          )}
          <span className="text-[11px] font-semibold mt-1 tracking-tight">
            Tarix
          </span>
        </button>

        {/* Tab 4: Profil */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'profile'
              ? 'text-[#2563EB]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Profil"
        >
          <User className="w-5 h-5" strokeWidth={activeTab === 'profile' ? 2.4 : 1.8} />
          <span className="text-[11px] font-semibold mt-1 tracking-tight">
            Profil
          </span>
        </button>
      </div>
    </nav>
  );
};
