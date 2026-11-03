import React, { useState } from 'react';
import { ParkingZone } from '../../types';
import { StatusBadge } from './StatusBadge';
import { STATUS_CONFIG } from '../../data/parkingData';
import { MapPin, Zap, ShieldCheck, Clock, Navigation, ArrowRight } from 'lucide-react';

interface ParkingCardProps {
  zone: ParkingZone;
  onSelectZone: (zone: ParkingZone) => void;
  onQuickBook: (zone: ParkingZone) => void;
  onOpenMapLocation: (zone: ParkingZone) => void;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({
  zone,
  onSelectZone,
  onQuickBook,
  onOpenMapLocation,
}) => {
  const [imgError, setImgError] = useState(false);
  const freeSpots = zone.totalSpots - zone.occupiedSpots;
  const occupancyPercent = Math.round((zone.occupiedSpots / zone.totalSpots) * 100);
  const statusCfg = STATUS_CONFIG[zone.status];

  return (
    <div className="sp-card-interactive group flex flex-col overflow-hidden bg-white">
      {/* Visual Header / Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {!imgError ? (
          <img
            src={zone.image}
            alt={zone.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <MapPin className="w-8 h-8 mb-1 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">{zone.name}</span>
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Status Badge in Top-Left */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={zone.status} />
        </div>

        {/* Rate in Top-Right */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-slate-100">
          <span className="text-xs font-semibold text-slate-900 tabular-nums">
            {zone.hourlyRate.toLocaleString('uz-UZ')}
          </span>
          <span className="text-[11px] text-slate-500 ml-1">so'm/soat</span>
        </div>

        {/* District & Location on Bottom scrim */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs text-white/80 font-medium">{zone.district}</p>
          <h3 className="text-base font-bold text-white tracking-tight truncate drop-shadow-xs">
            {zone.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        {/* Spot Availability Metrics */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium">Mavjud joylar:</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              <span style={{ color: statusCfg.color }} className="font-bold">
                {freeSpots} ta bo'sh
              </span>{' '}
              / {zone.totalSpots} ta
            </span>
          </div>

          {/* Clean Progress Bar with Status Color */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${occupancyPercent}%`,
                backgroundColor: statusCfg.color,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 tabular-nums">
            <span>To'ldirilganlik: {occupancyPercent}%</span>
            <span>{zone.operatingHours}</span>
          </div>
        </div>

        {/* Address and unboxed metadata */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{zone.address}</span>
          </div>
          
          {/* Unboxed subtle feature list */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
            {zone.features.slice(0, 3).map((feat, idx) => (
              <span key={feat} className="flex items-center gap-1">
                {idx > 0 && <span className="text-slate-300" aria-hidden="true">·</span>}
                {feat.includes('EV') && <Zap className="w-3 h-3 text-[#2563EB]" />}
                {feat.includes('Kamera') && <ShieldCheck className="w-3 h-3 text-slate-400" />}
                {feat.includes('rejim') && <Clock className="w-3 h-3 text-slate-400" />}
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => onSelectZone(zone)}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Joylar xaritasi</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
          
          <button
            onClick={() => onQuickBook(zone)}
            disabled={zone.status === 'full'}
            className={`w-full py-2 px-3 text-xs font-semibold rounded-xl text-white transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              zone.status === 'full'
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98]'
            }`}
          >
            {zone.status === 'full' ? "Joy yo'q" : "Band qilish"}
          </button>
        </div>
      </div>
    </div>
  );
};
