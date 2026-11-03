import React, { useState } from 'react';
import { Search, X, MapPin, Navigation2, SlidersHorizontal } from 'lucide-react';
import { ParkingZone } from '../../types';

interface MobileTopSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSelectDestination: (dest: { name: string; x: number; y: number }) => void;
  onCurrentLocationClick: () => void;
}

export const MobileTopSearchBar: React.FC<MobileTopSearchBarProps> = ({
  value,
  onChange,
  onSelectDestination,
  onCurrentLocationClick,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const quickDestinations = [
    { name: 'Amir Temur xiyoboni', x: 53, y: 48 },
    { name: 'Sayilgoh (Broadway)', x: 49, y: 47 },
    { name: 'Toshkent City Mall', x: 38, y: 44 },
    { name: 'TsUM va Navoiy teatri', x: 47, y: 56 },
    { name: 'Chorsu bozori', x: 26, y: 32 },
    { name: 'Oloy bozori', x: 57, y: 35 },
  ];

  const filteredSuggestions = value.trim()
    ? quickDestinations.filter((d) =>
        d.name.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  return (
    <div className="relative z-30 w-full max-w-md mx-auto">
      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-1.5 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-[#2563EB]/20 focus-within:border-[#2563EB]">
        {/* Search Icon */}
        <div className="pl-2.5 text-slate-400 shrink-0">
          <Search className="w-4 h-4 text-slate-400" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Manzilni kiriting"
          className="w-full py-1.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => {
              onChange('');
              setIsFocused(false);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Tozalash"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="w-px h-5 bg-slate-200 shrink-0 mx-0.5" />

        {/* GPS Current Location Target */}
        <button
          onClick={onCurrentLocationClick}
          className="p-2 text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors shrink-0"
          title="Mening joylashuvimga o'tish"
        >
          <Navigation2 className="w-4 h-4 fill-current rotate-45" />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isFocused && (value.trim().length > 0 || filteredSuggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Toshkent markaziy manzillari
          </div>
          {(filteredSuggestions.length > 0 ? filteredSuggestions : quickDestinations).map(
            (dest) => (
              <button
                key={dest.name}
                onClick={() => {
                  onChange(dest.name);
                  onSelectDestination(dest);
                  setIsFocused(false);
                }}
                className="w-full p-3 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold block truncate">{dest.name}</span>
                  <span className="text-[11px] text-slate-400">Toshkent markazi</span>
                </div>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};
