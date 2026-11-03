import React from 'react';
import { Car, MapPin, Clock, Palette } from 'lucide-react';

interface MobileTabBarProps {
  currentView: 'app' | 'design-system';
  onViewChange: (view: 'app' | 'design-system') => void;
  activeTab: 'list' | 'map' | 'session';
  onTabChange: (tab: 'list' | 'map' | 'session') => void;
  hasActiveSession: boolean;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentView,
  onViewChange,
  activeTab,
  onTabChange,
  hasActiveSession,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3">
      <div className="grid grid-cols-4 items-center h-12 max-w-md mx-auto">
        {/* Tab 1: List */}
        <button
          onClick={() => {
            onViewChange('app');
            onTabChange('list');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] ${
            currentView === 'app' && activeTab === 'list'
              ? 'text-[#2563EB]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5 whitespace-nowrap">
            Joylar
          </span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => {
            onViewChange('app');
            onTabChange('map');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] ${
            currentView === 'app' && activeTab === 'map'
              ? 'text-[#2563EB]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5 whitespace-nowrap">
            Xarita
          </span>
        </button>

        {/* Tab 3: Session */}
        <button
          onClick={() => {
            onViewChange('app');
            onTabChange('session');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] relative ${
            currentView === 'app' && activeTab === 'session'
              ? 'text-[#2563EB]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-5 h-5" />
          {hasActiveSession && (
            <span className="absolute top-1 right-7 w-2 h-2 rounded-full bg-[#16A34A]" />
          )}
          <span className="text-[10px] font-semibold mt-0.5 whitespace-nowrap">
            Sessiya
          </span>
        </button>

        {/* Tab 4: Design System */}
        <button
          onClick={() => onViewChange('design-system')}
          className={`flex flex-col items-center justify-center min-h-[44px] ${
            currentView === 'design-system'
              ? 'text-[#2563EB]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5 whitespace-nowrap">
            Dizayn
          </span>
        </button>
      </div>
    </div>
  );
};
