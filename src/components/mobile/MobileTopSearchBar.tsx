import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, MapPin, Navigation2, Map as MapIcon, LocateFixed, ParkingSquare } from 'lucide-react';
import { ParkingZone, UserLocation } from '../../types';
import { STATUS_CONFIG } from '../../data/parkingData';
import { ALL_PLACES, TASHKENT_DISTRICTS, Place } from '../../data/places';
import { normalizeText } from '../../utils/geo';

type SearchMode = 'parking' | 'location';

interface MobileTopSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  /** Toshkentning barcha hududlaridagi parkinglar (masofa foydalanuvchi joyidan hisoblangan) */
  zones: ParkingZone[];
  userLocation: UserLocation;
  onSelectZone: (zone: ParkingZone) => void;
  /** "Mening joyim" rejimida joy tanlanganda */
  onSelectPlace: (place: Place) => void;
  onCurrentLocationClick: () => void;
  onPickOnMap: () => void;
  isPickingLocation: boolean;
}

const SOURCE_LABEL: Record<UserLocation['source'], string> = {
  loading: 'Aniqlanmoqda…',
  gps: 'GPS',
  manual: 'Tanlangan',
  default: 'Taxminiy',
};

export const MobileTopSearchBar: React.FC<MobileTopSearchBarProps> = ({
  value,
  onChange,
  zones,
  userLocation,
  onSelectZone,
  onSelectPlace,
  onCurrentLocationClick,
  onPickOnMap,
  isPickingLocation,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [mode, setMode] = useState<SearchMode>('parking');
  const rootRef = useRef<HTMLDivElement>(null);

  // Tashqariga bosilganda ro'yxatni yopish
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  const query = normalizeText(value);

  const sortedZones = useMemo(
    () => [...zones].sort((a, b) => a.distanceMeters - b.distanceMeters),
    [zones]
  );

  // Parking qidiruvi: nom, tuman, manzil, "Parking #N" bo'yicha — barcha tumanlardan
  const parkingResults = useMemo(() => {
    if (!query) return sortedZones.slice(0, 8);
    return sortedZones.filter((z) => {
      const hay = normalizeText(
        `${z.name} ${z.district} ${z.address} ${z.displayName} ${z.codeNumber}`
      );
      return hay.includes(query);
    });
  }, [query, sortedZones]);

  // Joylashuv qidiruvi: tumanlar va mashhur joylar
  const placeResults = useMemo(() => {
    if (!query) return ALL_PLACES;
    return ALL_PLACES.filter((p) => normalizeText(`${p.name} ${p.subtitle}`).includes(query));
  }, [query]);

  const openDropdown = (m: SearchMode) => {
    setMode(m);
    setIsFocused(true);
    if (m !== mode) onChange('');
  };

  const placeholder =
    mode === 'parking' ? 'Parking qidiring: tuman, manzil, nom' : 'Joylashuvingizni qidiring';

  return (
    <div ref={rootRef} className="relative z-30 w-full max-w-md mx-auto">
      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-1.5 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-[#2563EB]/20 focus-within:border-[#2563EB]">
        <div className="pl-2.5 text-slate-400 shrink-0">
          <Search className="w-4 h-4 text-slate-400" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full py-1.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
        />

        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Tozalash"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="w-px h-5 bg-slate-200 shrink-0 mx-0.5" />

        {/* GPS orqali joylashuvni qayta aniqlash */}
        <button
          onClick={() => {
            setIsFocused(false);
            onCurrentLocationClick();
          }}
          className="p-2 text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors shrink-0"
          title="Mening joylashuvimga o'tish (GPS)"
          aria-label="Mening joylashuvim"
        >
          <Navigation2 className="w-4 h-4 fill-current rotate-45" />
        </button>
      </div>

      {/* Joriy joylashuv chipi */}
      <button
        onClick={() => openDropdown('location')}
        className="mt-2 max-w-full inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-full shadow border border-slate-200/80 pl-2 pr-3 py-1 text-[11px] text-slate-600 hover:bg-white transition-colors"
        title="Joylashuvni o'zgartirish"
      >
        <LocateFixed className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
        <span className="font-semibold text-slate-800 shrink-0">Siz turgan joy:</span>
        <span className="truncate">{userLocation.label}</span>
        <span className="shrink-0 text-[10px] font-bold text-[#2563EB] bg-blue-50 rounded px-1.5 py-0.5">
          {SOURCE_LABEL[userLocation.source]}
        </span>
      </button>

      {/* Dropdown */}
      {isFocused && !isPickingLocation && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Rejim tanlash */}
          <div className="p-1.5 flex gap-1 bg-slate-50 border-b border-slate-100">
            {(
              [
                { id: 'parking', label: 'Parking qidirish', icon: ParkingSquare },
                { id: 'location', label: 'Mening joyim', icon: MapPin },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  if (mode !== t.id) {
                    setMode(t.id);
                    onChange('');
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  mode === t.id ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {mode === 'parking' ? (
              <>
                {!query && (
                  <div className="px-3 py-2 flex flex-wrap gap-1.5 border-b border-slate-100">
                    {TASHKENT_DISTRICTS.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => onChange(d.name.replace(' tumani', ''))}
                        className="px-2 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] text-[11px] font-medium text-slate-600 transition-colors"
                      >
                        {d.name.replace(' tumani', '')}
                      </button>
                    ))}
                  </div>
                )}

                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {query
                    ? `Topilgan parkinglar: ${parkingResults.length}`
                    : 'Sizga eng yaqin parkinglar'}
                </div>

                {parkingResults.length === 0 && (
                  <div className="px-3 py-6 text-center text-xs text-slate-400">
                    Hech narsa topilmadi. Tuman yoki manzil nomini boshqacha yozib ko'ring.
                  </div>
                )}

                {parkingResults.map((z) => {
                  const cfg = STATUS_CONFIG[z.status];
                  const free = z.totalSpots - z.occupiedSpots;
                  return (
                    <button
                      key={z.id}
                      onClick={() => {
                        onChange(z.name);
                        onSelectZone(z);
                        setIsFocused(false);
                      }}
                      className="w-full px-3 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-black"
                        style={{ backgroundColor: cfg.badgeBg, color: cfg.color }}
                      >
                        P
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold block truncate">
                          {z.displayName} · {z.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {z.district} · {z.address}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block font-bold text-slate-700">{z.distance}</span>
                        <span className="block text-[10px] font-semibold" style={{ color: cfg.color }}>
                          {free > 0 ? `${free} bo'sh` : "To'la"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsFocused(false);
                    onCurrentLocationClick();
                  }}
                  className="w-full px-3 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                    <LocateFixed className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold">GPS orqali avtomatik aniqlash</span>
                </button>

                <button
                  onClick={() => {
                    setIsFocused(false);
                    onPickOnMap();
                  }}
                  className="w-full px-3 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                    <MapIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold">Xaritadan tanlash</span>
                </button>

                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Tumanlar va mashhur joylar
                </div>

                {placeResults.length === 0 && (
                  <div className="px-3 py-6 text-center text-xs text-slate-400">
                    Joy topilmadi. "Xaritadan tanlash" orqali belgilang.
                  </div>
                )}

                {placeResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onChange('');
                      onSelectPlace(p);
                      setIsFocused(false);
                    }}
                    className="w-full px-3 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold block truncate">{p.name}</span>
                      <span className="text-[11px] text-slate-400">{p.subtitle}</span>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
