import React from 'react';
import { ParkingZone } from '../../types';
import { STATUS_CONFIG } from '../../data/parkingData';
import { MapPin, Navigation, CalendarCheck, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

interface MobileBookingTabProps {
  zones: ParkingZone[];
  onSelectZone: (zone: ParkingZone) => void;
  onBookZone: (zone: ParkingZone) => void;
}

export const MobileBookingTab: React.FC<MobileBookingTabProps> = ({
  zones,
  onSelectZone,
  onBookZone,
}) => {
  return (
    <div className="p-4 space-y-4 pb-24 max-w-md mx-auto">
      {/* Title */}
      <div className="pt-2">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Band Qilish
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Toshkent markazidagi avtoturargohlardan oldindan joy band qiling
        </p>
      </div>

      {/* List of Parking Zones */}
      <div className="space-y-3">
        {zones.map((zone) => {
          const freeSpots = zone.totalSpots - zone.occupiedSpots;
          const statusCfg = STATUS_CONFIG[zone.status];

          return (
            <div
              key={zone.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between gap-3 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusCfg.color }}
                    />
                    <span className="text-[11px] font-semibold text-slate-500">
                      {zone.district}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {zone.displayName} — {zone.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{zone.address} ({zone.distance})</span>
                  </p>
                </div>

                <div
                  className="px-2.5 py-1 rounded-full text-xs font-bold shrink-0 border"
                  style={{
                    backgroundColor: statusCfg.badgeBg,
                    borderColor: `${statusCfg.color}40`,
                    color: statusCfg.color === '#EAB308' ? '#B45309' : statusCfg.color,
                  }}
                >
                  {statusCfg.label}
                </div>
              </div>

              {/* Spots & Rate Row */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Bo'sh joy:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {freeSpots} / {zone.totalSpots} ta
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] font-sans">Tarif:</span>
                  <span className="font-bold text-[#2563EB] tabular-nums">
                    {zone.hourlyRate.toLocaleString('uz-UZ')} so'm/soat
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onSelectZone(zone)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Xaritada ko'rish
                </button>
                <button
                  onClick={() => onBookZone(zone)}
                  disabled={zone.status === 'full'}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold text-white transition-all ${
                    zone.status === 'full'
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
                  }`}
                >
                  Band qilish
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
