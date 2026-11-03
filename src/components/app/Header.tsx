import React from 'react';
import { Car, Smartphone, Monitor, ShieldCheck, MapPin } from 'lucide-react';

interface HeaderProps {
  currentView: 'app' | 'design-system';
  onViewChange: (view: 'app' | 'design-system') => void;
  activeTab: 'list' | 'map' | 'session';
  onTabChange: (tab: 'list' | 'map' | 'session') => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  hasActiveSession: boolean;
  onQuickBookTrigger: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  activeTab,
  onTabChange,
  isMobileFrame,
  onToggleMobileFrame,
  hasActiveSession,
  onQuickBookTrigger,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onViewChange('app');
              onTabChange('list');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              P
            </div>
            <span>Smart Parking</span>
          </a>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => {
              onViewChange('app');
              onTabChange('list');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'app' && activeTab === 'list'
                ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                : 'hover:text-slate-900'
            }`}
          >
            Avtoturargohlar
          </button>

          <button
            onClick={() => {
              onViewChange('app');
              onTabChange('map');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'app' && activeTab === 'map'
                ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                : 'hover:text-slate-900'
            }`}
          >
            Shahar Xaritasi
          </button>

          <button
            onClick={() => {
              onViewChange('app');
              onTabChange('session');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentView === 'app' && activeTab === 'session'
                ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                : 'hover:text-slate-900'
            }`}
          >
            <span>Faol Sessiya</span>
            {hasActiveSession && (
              <span className="ml-1.5 w-2 h-2 inline-block rounded-full bg-[#16A34A] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => onViewChange('design-system')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'design-system'
                ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                : 'hover:text-slate-900'
            }`}
          >
            Dizayn Tizimi
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile frame emulator toggle */}
          <button
            onClick={onToggleMobileFrame}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            title="Mobil / Desktop ko'rinishini almashtirish"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Katta Ekran</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>Mobil Ramka</span>
              </>
            )}
          </button>

          <button
            onClick={onQuickBookTrigger}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 active:scale-[0.98]"
          >
            Joy Band Qilish
          </button>
        </div>
      </div>
    </header>
  );
};
