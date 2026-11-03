import React, { useState } from 'react';
import { ParkingZone } from '../../types';
import { STATUS_CONFIG } from '../../data/parkingData';
import { Navigation, CalendarCheck, MapPin, Zap, ChevronUp, ChevronDown, CheckCircle2, Phone, Clock } from 'lucide-react';

interface MobileBottomSheetCardProps {
  zone: ParkingZone;
  onNavigate: (zone: ParkingZone) => void;
  onBook: (zone: ParkingZone) => void;
  isNavigating?: boolean;
  onCancelNavigation?: () => void;
}

export const MobileBottomSheetCard: React.FC<MobileBottomSheetCardProps> = ({
  zone,
  onNavigate,
  onBook,
  isNavigating = false,
  onCancelNavigation,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const freeSpots = zone.totalSpots - zone.occupiedSpots;
  const statusCfg = STATUS_CONFIG[zone.status];

  // Exact prompt text format:
  // "Parking #1 — 1.2 km"
  // "Bo'sh joy: 14 / 50"
  // "Narx: 5 000 so'm/soat"
  const titleDisplay = `${zone.displayName} — ${zone.distance}`;
  const spotsDisplay = `Bo'sh joy: ${freeSpots} / ${zone.totalSpots}`;
  const priceDisplay = `Narx: ${zone.hourlyRate.toLocaleString('uz-UZ')} so'm/soat`;

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300">
      {/* Drag / Expand Handle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2.5 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
      </div>

      <div className="px-5 pb-5 pt-1 space-y-4">
        {/* Header: Parking Title and Distance */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: statusCfg.color }}
              />
              <span className="text-xs font-semibold text-slate-500">
                {zone.name}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans truncate">
              {titleDisplay}
            </h3>
          </div>

          {/* Quick status badge */}
          <div
            className="px-2.5 py-1 rounded-full text-xs font-bold border shrink-0"
            style={{
              backgroundColor: statusCfg.badgeBg,
              borderColor: `${statusCfg.color}40`,
              color: statusCfg.color === '#EAB308' ? '#B45309' : statusCfg.color,
            }}
          >
            {statusCfg.label}
          </div>
        </div>

        {/* Metrics Row: Bo'sh joy & Narx */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">
              Mavjud o'rinlar:
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono tabular-nums flex items-center gap-1.5 mt-0.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: statusCfg.color }}
              />
              <span className="text-slate-900 font-bold">{spotsDisplay}</span>
            </span>
          </div>

          <div className="border-l border-slate-200/80 pl-3">
            <span className="text-[11px] text-slate-400 font-medium block">
              Soatlik to'lov:
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono tabular-nums block mt-0.5">
              {priceDisplay}
            </span>
          </div>
        </div>

        {/* Expandable Details Section */}
        {isExpanded && (
          <div className="space-y-3 pt-1 border-t border-slate-100 text-xs text-slate-600 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{zone.address} ({zone.district})</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Ish vaqti: {zone.operatingHours}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {zone.features.map((feat) => (
                <span
                  key={feat}
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-600"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Mode Banner */}
        {isNavigating && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#2563EB] animate-pulse" />
              <div className="text-xs">
                <span className="font-bold text-[#2563EB] block">
                  Marshrut tuzildi: {zone.distance} · 4 daqiqa
                </span>
                <span className="text-[11px] text-slate-500">
                  Amir Temur shoh ko'chasidan harakatlaning
                </span>
              </div>
            </div>
            <button
              onClick={onCancelNavigation}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-white"
            >
              Bekor qilish
            </button>
          </div>
        )}

        {/* Two Buttons: Outlined "YO'NALISH" and Filled Blue "BAND QILISH" */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Outlined "YO'NALISH" */}
          <button
            onClick={() => onNavigate(zone)}
            className={`w-full h-12 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 select-none border-2 ${
              isNavigating
                ? 'border-[#2563EB] bg-blue-50/70 text-[#2563EB]'
                : 'border-slate-800 text-slate-900 bg-white hover:bg-slate-50 active:scale-[0.98]'
            }`}
          >
            <Navigation className={`w-4 h-4 ${isNavigating ? 'text-[#2563EB]' : 'text-slate-800'}`} />
            <span>YO'NALISH</span>
          </button>

          {/* Filled Blue "BAND QILISH" (#2563EB) */}
          <button
            onClick={() => onBook(zone)}
            disabled={zone.status === 'full'}
            className={`w-full h-12 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase text-white transition-all flex items-center justify-center gap-2 shadow-sm select-none ${
              zone.status === 'full'
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] shadow-blue-500/20'
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-white" />
            <span>BAND QILISH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
