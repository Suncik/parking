import React from 'react';

interface MobileMapLegendProps {
  activeFilter?: 'all' | 'free' | 'warning' | 'full';
  onFilterToggle?: (filter: 'free' | 'warning' | 'full') => void;
}

export const MobileMapLegend: React.FC<MobileMapLegendProps> = ({
  activeFilter,
  onFilterToggle,
}) => {
  return (
    <div className="inline-flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/80 text-[11px] font-semibold text-slate-700 select-none">
      {/* 🟢 Bo'sh parking */}
      <button
        type="button"
        onClick={() => onFilterToggle?.('free')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-colors ${
          activeFilter === 'free'
            ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300'
            : 'hover:bg-slate-50 text-slate-700'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
        <span>Bo'sh parking</span>
      </button>

      <span className="text-slate-300" aria-hidden="true">·</span>

      {/* 🟡 Deyarli to'la */}
      <button
        type="button"
        onClick={() => onFilterToggle?.('warning')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-colors ${
          activeFilter === 'warning'
            ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
            : 'hover:bg-slate-50 text-slate-700'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] shrink-0" />
        <span>Deyarli to'la</span>
      </button>

      <span className="text-slate-300" aria-hidden="true">·</span>

      {/* 🔴 Bo'sh joy yo'q */}
      <button
        type="button"
        onClick={() => onFilterToggle?.('full')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-colors ${
          activeFilter === 'full'
            ? 'bg-rose-50 text-rose-800 ring-1 ring-rose-300'
            : 'hover:bg-slate-50 text-slate-700'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] shrink-0" />
        <span>Bo'sh joy yo'q</span>
      </button>
    </div>
  );
};
