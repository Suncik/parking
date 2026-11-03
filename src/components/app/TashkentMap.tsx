import React, { useState } from 'react';
import { ParkingZone, ParkingStatus } from '../../types';
import { STATUS_CONFIG } from '../../data/parkingData';
import { StatusBadge } from './StatusBadge';
import { MapPin, Navigation, Info, Car, Zap, Check } from 'lucide-react';

interface TashkentMapProps {
  zones: ParkingZone[];
  selectedZone: ParkingZone | null;
  onSelectZone: (zone: ParkingZone) => void;
  onBookZone: (zone: ParkingZone) => void;
  filterStatus: 'all' | ParkingStatus;
  onFilterChange: (status: 'all' | ParkingStatus) => void;
}

export const TashkentMap: React.FC<TashkentMapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  onBookZone,
  filterStatus,
  onFilterChange,
}) => {
  const [hoveredZone, setHoveredZone] = useState<ParkingZone | null>(null);

  const filteredZones = filterStatus === 'all'
    ? zones
    : zones.filter(z => z.status === filterStatus);

  const activeZone = hoveredZone || selectedZone;

  return (
    <div className="sp-card overflow-hidden bg-white flex flex-col">
      {/* Map Control Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#2563EB]" />
            <span>Toshkent Shahar Avtoturargohlar Xaritasi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real vaqt rejimida bo'sh va band joylar holati
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Barchasi ({zones.length})
          </button>
          <button
            onClick={() => onFilterChange('free')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'free'
                ? 'bg-white text-[#16A34A] shadow-xs'
                : 'text-slate-600 hover:text-[#16A34A]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span>Bo'sh</span>
          </button>
          <button
            onClick={() => onFilterChange('warning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'warning'
                ? 'bg-white text-[#B45309] shadow-xs'
                : 'text-slate-600 hover:text-[#B45309]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
            <span>Deyarli to'lgan</span>
          </button>
          <button
            onClick={() => onFilterChange('full')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'full'
                ? 'bg-white text-[#DC2626] shadow-xs'
                : 'text-slate-600 hover:text-[#DC2626]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
            <span>To'lgan</span>
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full h-[460px] bg-[#F8FAFC] overflow-hidden select-none">
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="tashkentGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
            </pattern>
            {/* Soft Radial Gradients for Rings */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1000" height="650" fill="#F8FAFC" />
          <rect width="1000" height="650" fill="url(#tashkentGrid)" />

          {/* Tashkent City Center Glow */}
          <circle cx="500" cy="340" r="280" fill="url(#centerGlow)" />

          {/* Anhor and Bo'zsuv Canals (Iconic waterways of Tashkent) */}
          <path
            d="M 180,20 Q 320,160 420,290 T 520,440 T 640,640"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.65"
          />
          <text x="360" y="220" fill="#60A5FA" fontSize="12" fontWeight="600" opacity="0.8" transform="rotate(35 360,220)">
            Anhor kanali
          </text>

          <path
            d="M 680,30 Q 600,180 540,280 T 480,480 T 360,630"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Tashkent Ring Roads (Kichik Halqa Yo'li & Katta Halqa Yo'li) */}
          {/* Outer Ring Road */}
          <ellipse
            cx="500"
            cy="340"
            rx="420"
            ry="270"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="8"
            strokeDasharray="6 4"
            opacity="0.7"
          />
          <text x="760" y="210" fill="#94A3B8" fontSize="11" fontWeight="600">
            KATTA HALQA YO'LI (KHY)
          </text>

          {/* Inner Ring Road */}
          <ellipse
            cx="490"
            cy="340"
            rx="270"
            ry="180"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="6"
            opacity="0.85"
          />
          <text x="300" y="195" fill="#64748B" fontSize="11" fontWeight="600">
            KICHIK HALQA YO'LI
          </text>

          {/* Major Avenues (Navoiy, Amir Temur, Chilonzor, Shota Rustaveli) */}
          <line x1="500" y1="50" x2="500" y2="600" stroke="#CBD5E1" strokeWidth="5" opacity="0.8" />
          <text x="508" y="130" fill="#64748B" fontSize="12" fontWeight="600">
            Amir Temur shoh ko'chasi
          </text>
          
          <line x1="120" y1="340" x2="880" y2="340" stroke="#CBD5E1" strokeWidth="5" opacity="0.8" />
          <text x="180" y="332" fill="#64748B" fontSize="12" fontWeight="600">
            Alisher Navoiy shoh ko'chasi
          </text>

          <line x1="200" y1="500" x2="680" y2="180" stroke="#E2E8F0" strokeWidth="4" />
          <line x1="320" y1="560" x2="720" y2="280" stroke="#E2E8F0" strokeWidth="4" />

          {/* District Labels */}
          <g fill="#94A3B8" fontSize="13" fontWeight="700" letterSpacing="0.08em" opacity="0.8">
            <text x="440" y="80">YUNUSOBOD</text>
            <text x="700" y="260">MIRZO ULUG'BEK</text>
            <text x="640" y="520">MIROBOD</text>
            <text x="220" y="520">CHILONZOR</text>
            <text x="220" y="210">OLMAZOR</text>
            <text x="400" y="470">YAKKASAROY</text>
            <text x="360" y="325">SHAYXONTOHUR</text>
          </g>

          {/* Central Landmark Ring: Amir Temur Maydoni */}
          <circle cx="510" cy="340" r="24" fill="#2563EB" fillOpacity="0.1" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
          <text x="510" y="344" fill="#2563EB" fontSize="9" fontWeight="bold" textAnchor="middle">
            Markaz
          </text>

          {/* Green Parks Visuals */}
          <rect x="425" y="310" width="35" height="25" rx="8" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" />
          <text x="442" y="326" fill="#16A34A" fontSize="8" fontWeight="bold" textAnchor="middle">City Park</text>

          <circle cx="615" cy="300" r="22" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" />
          <text x="615" y="303" fill="#16A34A" fontSize="8" fontWeight="bold" textAnchor="middle">Ecopark</text>

          <rect x="360" y="420" width="30" height="25" rx="6" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" />
          <text x="375" y="435" fill="#16A34A" fontSize="8" fontWeight="bold" textAnchor="middle">Magic City</text>

          {/* Interactive Pins for each Parking Zone */}
          {filteredZones.map((zone) => {
            const posX = (zone.coordinates.x / 100) * 1000;
            const posY = (zone.coordinates.y / 100) * 650;
            const isSelected = selectedZone?.id === zone.id;
            const isHovered = hoveredZone?.id === zone.id;
            const statusCfg = STATUS_CONFIG[zone.status];
            const freeCount = zone.totalSpots - zone.occupiedSpots;

            return (
              <g
                key={zone.id}
                className="cursor-pointer transition-transform duration-200"
                transform={`translate(${posX}, ${posY})`}
                onClick={() => onSelectZone(zone)}
                onMouseEnter={() => setHoveredZone(zone)}
                onMouseLeave={() => setHoveredZone(null)}
              >
                {/* Ping wave for selected or hovered pin */}
                {(isSelected || isHovered) && (
                  <circle
                    r="28"
                    fill={statusCfg.color}
                    opacity="0.2"
                    className="animate-ping"
                  />
                )}

                {/* Outer Shadow Circle */}
                <circle
                  r={isSelected ? '22' : '18'}
                  fill="white"
                  stroke={statusCfg.color}
                  strokeWidth={isSelected ? '3.5' : '2.5'}
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                />

                {/* Inner Color Fill */}
                <circle
                  r={isSelected ? '16' : '13'}
                  fill={statusCfg.color}
                />

                {/* Free Spots Number or P inside */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="white"
                  fontSize={isSelected ? '11' : '10'}
                  fontWeight="bold"
                  className="font-mono tabular-nums select-none"
                >
                  {freeCount > 99 ? '99+' : freeCount}
                </text>

                {/* Pin Tooltip Bubble */}
                <g
                  transform="translate(0, -32)"
                  opacity={isSelected || isHovered ? 1 : 0.9}
                >
                  <rect
                    x="-65"
                    y="-20"
                    width="130"
                    height="22"
                    rx="6"
                    fill="#0F172A"
                    opacity="0.9"
                  />
                  <text
                    x="0"
                    y="-5"
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {zone.name.split(' ')[0]} {zone.name.split(' ')[1] || ''}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Detail Card when zone selected */}
        {activeZone && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 sp-card p-3.5 shadow-lg border border-slate-200/80 bg-white/95 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200 z-10">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={activeZone.status} size="sm" />
                  <span className="text-[11px] text-slate-500 font-medium">
                    {activeZone.district}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {activeZone.name}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {activeZone.address}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Tarif:</span>
                <p className="text-xs font-bold text-slate-900 tabular-nums">
                  {activeZone.hourlyRate.toLocaleString('uz-UZ')} so'm/soat
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Bo'sh joy:</span>
                <p className="text-xs font-bold text-[#16A34A] tabular-nums">
                  {activeZone.totalSpots - activeZone.occupiedSpots} ta joy
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectZone(activeZone)}
                className="py-1.5 px-2.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                Joylar rejasi
              </button>
              <button
                onClick={() => onBookZone(activeZone)}
                disabled={activeZone.status === 'full'}
                className={`py-1.5 px-2.5 text-xs font-semibold rounded-lg text-white transition-colors ${
                  activeZone.status === 'full'
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
                }`}
              >
                Band qilish
              </button>
            </div>
          </div>
        )}

        {/* Legend in Top-Right */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200/80 shadow-xs hidden sm:block text-xs space-y-1.5">
          <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Status belgilari
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            <span className="text-slate-700">Bo'sh (&gt; 25%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
            <span className="text-slate-700">Deyarli to'lgan (5–25%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <span className="text-slate-700">To'lgan (&lt; 5%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
