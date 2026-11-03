import React, { useState } from 'react';
import { ParkingZone, ParkingSpot, SpotType } from '../../types';
import { UzbekPlate } from './UzbekPlate';
import { StatusBadge } from './StatusBadge';
import { X, Zap, Accessibility, Car, Check, ShieldCheck, MapPin } from 'lucide-react';

interface SpotSelectorModalProps {
  zone: ParkingZone;
  onClose: () => void;
  onConfirmSpot: (zone: ParkingZone, spot: ParkingSpot) => void;
}

export const SpotSelectorModal: React.FC<SpotSelectorModalProps> = ({
  zone,
  onClose,
  onConfirmSpot,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string>('1-qavat');
  const [typeFilter, setTypeFilter] = useState<'all' | SpotType>('all');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  const floors = ['1-qavat', '-1 qavat'];

  const filteredSpots = zone.spots.filter((s) => {
    const matchFloor = s.floor === selectedFloor;
    const matchType = typeFilter === 'all' || s.type === typeFilter;
    return matchFloor && matchType;
  });

  const freeSpotsCount = zone.spots.filter((s) => s.status === 'free').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={zone.status} />
              <span className="text-xs text-slate-500 font-medium">
                {zone.district}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{zone.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{zone.address}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Floor Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200/80">
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedFloor === floor
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {floor}
              </button>
            ))}
          </div>

          {/* Spot Type Filters */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                typeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              Hammasi
            </button>
            <button
              onClick={() => setTypeFilter('ev')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                typeFilter === 'ev'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>EV Quvvatlash</span>
            </button>
            <button
              onClick={() => setTypeFilter('disabled')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                typeFilter === 'disabled'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              <Accessibility className="w-3 h-3 text-[#2563EB]" />
              <span>Nogironlar</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="px-5 py-2 text-xs flex flex-wrap items-center gap-4 text-slate-600 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md border-2 border-[#16A34A] bg-emerald-50" />
            <span>Bo'sh joy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-300" />
            <span>Band joy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#2563EB] text-white flex items-center justify-center">
              <Check className="w-2 h-2" />
            </span>
            <span>Siz tanlagan joy</span>
          </div>
        </div>

        {/* Spots Grid */}
        <div className="p-5 overflow-y-auto flex-1 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredSpots.map((spot) => {
              const isOccupied = spot.status === 'occupied';
              const isSelected = selectedSpot?.id === spot.id;

              return (
                <button
                  key={spot.id}
                  disabled={isOccupied}
                  onClick={() => setSelectedSpot(spot)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28 ${
                    isSelected
                      ? 'bg-blue-50/50 border-[#2563EB] ring-2 ring-[#2563EB]/30 shadow-md'
                      : isOccupied
                      ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                      : 'bg-white border-slate-200 hover:border-[#16A34A] hover:bg-emerald-50/20 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                      {spot.code}
                    </span>
                    <div className="flex items-center gap-1">
                      {spot.type === 'ev' && (
                        <span title="Elektr quvvatlash stantsiyasi" className="p-1 rounded-md bg-blue-100 text-[#2563EB]">
                          <Zap className="w-3 h-3" />
                        </span>
                      )}
                      {spot.type === 'disabled' && (
                        <span title="Maxsus nogironlar joyi" className="p-1 rounded-md bg-slate-100 text-slate-700">
                          <Accessibility className="w-3 h-3" />
                        </span>
                      )}
                      {isSelected && (
                        <span className="p-1 rounded-md bg-[#2563EB] text-white">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto">
                    {isOccupied ? (
                      <div>
                        <span className="text-[10px] font-semibold text-[#DC2626] block">
                          Band
                        </span>
                        {spot.vehiclePlate && (
                          <span className="text-[10px] font-mono text-slate-500 truncate block">
                            {spot.vehiclePlate}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          <span>Bo'sh</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {spot.floor}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredSpots.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              Tanlangan filtr bo'yicha joylar topilmadi.
            </div>
          )}
        </div>

        {/* Footer with Selection & Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            {selectedSpot ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Tanlangan joy:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {selectedSpot.code} ({selectedSpot.floor})
                </span>
                <span className="text-xs text-[#16A34A] font-semibold">
                  · Bo'sh
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Iltimos, avtoturargoh rejasidan bo'sh joyni tanlang
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Bekor qilish
            </button>
            <button
              disabled={!selectedSpot}
              onClick={() => selectedSpot && onConfirmSpot(zone, selectedSpot)}
              className={`px-5 py-2.5 text-xs font-semibold rounded-xl text-white transition-all shadow-xs ${
                selectedSpot
                  ? 'bg-[#2563EB] hover:bg-[#1D4ED8]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              Band qilishga o'tish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
