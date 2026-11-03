import React, { useState, useRef, useEffect } from 'react';
import { ParkingZone, ParkingStatus } from '../../types';
import { STATUS_CONFIG } from '../../data/parkingData';
import { Plus, Minus, Navigation2, Compass, Layers } from 'lucide-react';

interface MobileOSMMapProps {
  zones: ParkingZone[];
  selectedZone: ParkingZone;
  onSelectZone: (zone: ParkingZone) => void;
  isNavigating: boolean;
  filterStatus?: 'all' | ParkingStatus;
  mapCenterTrigger?: number; // timestamp to force recenter
}

export const MobileOSMMap: React.FC<MobileOSMMapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  isNavigating,
  filterStatus = 'all',
  mapCenterTrigger = 0,
}) => {
  // Map pan and zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // User position in central Tashkent (Sayilgoh / Broadway)
  const userLocation = { x: 48.5, y: 51.5 };

  // Recenter when trigger changes
  useEffect(() => {
    if (mapCenterTrigger > 0) {
      setPan({ x: 0, y: 0 });
      setZoom(1.1);
    }
  }, [mapCenterTrigger]);

  // Recenter on selected zone
  useEffect(() => {
    if (selectedZone) {
      const offsetX = (50 - selectedZone.coordinates.x) * 6;
      const offsetY = (50 - selectedZone.coordinates.y) * 4;
      setPan({ x: offsetX, y: offsetY });
    }
  }, [selectedZone.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const filteredZones = filterStatus === 'all'
    ? zones
    : zones.filter((z) => z.status === filterStatus);

  // SVG dimensions
  const mapWidth = 1000;
  const mapHeight = 1000;

  // Convert percentages to SVG units
  const userSvgX = (userLocation.x / 100) * mapWidth;
  const userSvgY = (userLocation.y / 100) * mapHeight;

  const targetSvgX = (selectedZone.coordinates.x / 100) * mapWidth;
  const targetSvgY = (selectedZone.coordinates.y / 100) * mapHeight;

  // Compute waypoint for realistic city street routing
  const midX = targetSvgX;
  const midY = userSvgY;

  return (
    <div
      className="relative w-full h-full bg-[#F2EFE9] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* SVG Vector OpenStreetMap Canvas */}
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        <defs>
          {/* OSM Subtle Block Texture */}
          <pattern id="osmGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="#F2EFE9" />
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#E9E5DD" strokeWidth="0.8" />
          </pattern>

          {/* User GPS pulse animation */}
          <radialGradient id="userGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Base Land Canvas */}
        <rect width="1000" height="1000" fill="url(#osmGrid)" />

        {/* 2. City Urban Landuse Blocks (OSM #E8E4DD) */}
        <g fill="#EAE5DC" stroke="#DFD9D0" strokeWidth="1">
          <rect x="180" y="220" width="160" height="180" rx="4" />
          <rect x="380" y="200" width="140" height="120" rx="4" />
          <rect x="560" y="180" width="200" height="140" rx="4" />
          <rect x="220" y="580" width="180" height="170" rx="4" />
          <rect x="440" y="620" width="160" height="160" rx="4" />
          <rect x="630" y="560" width="190" height="180" rx="4" />
          <rect x="720" y="340" width="160" height="180" rx="4" />
          <rect x="120" y="440" width="150" height="120" rx="4" />
        </g>

        {/* 3. Parks & Green Areas (OSM #CCE2CB / #D0E6C5) */}
        <g fill="#CCE2CB" stroke="#B8DAB6" strokeWidth="1">
          {/* Amir Temur Square Central Radial Park */}
          <circle cx="530" cy="480" r="55" />
          
          {/* Tashkent City Park Area */}
          <path d="M 330,400 L 420,400 L 430,480 L 340,490 Z" rx="10" />
          
          {/* Sayilgoh / Broadway Tree Alley */}
          <rect x="460" y="465" width="60" height="30" rx="4" />

          {/* Central Park (Mirzo Ulug'bek) */}
          <rect x="650" y="400" width="90" height="70" rx="8" />

          {/* Navoiy Opera & Ballet Theater Garden & TsUM */}
          <circle cx="470" cy="560" r="35" />

          {/* Mustaqillik Square Lawns */}
          <rect x="430" y="360" width="70" height="50" rx="6" />

          {/* Ecopark Woods */}
          <ellipse cx="670" cy="440" rx="50" ry="40" />

          {/* Anhor Riverside Promenade */}
          <path
            d="M 280,100 Q 300,300 320,450 T 350,750 L 365,750 Q 335,450 315,300 T 295,100 Z"
            fill="#D5E8CE"
            stroke="none"
          />
        </g>

        {/* 4. Pedestrian Promenades (OSM #F3E6D8) */}
        <g fill="#F3E6D8" stroke="#E5D3C1" strokeWidth="1">
          {/* Sayilgoh Pedestrian Street (Broadway) */}
          <rect x="440" y="472" width="80" height="14" rx="2" />
          {/* Amir Temur Round Pedestrian Plaza */}
          <circle cx="530" cy="480" r="28" fill="#F3E6D8" stroke="#DCC7B3" strokeWidth="1.5" />
        </g>

        {/* 5. Waterways (Anhor Canal & Salor - OSM #AAD3DF) */}
        <g fill="none">
          {/* Anhor Canal (Iconic river of Tashkent) */}
          <path
            d="M 290,0 Q 310,250 330,440 T 360,780 T 380,1000"
            stroke="#AAD3DF"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M 290,0 Q 310,250 330,440 T 360,780 T 380,1000"
            stroke="#85B9CA"
            strokeWidth="1.5"
          />

          {/* Salor Canal Branch */}
          <path
            d="M 640,0 Q 610,300 580,550 T 540,1000"
            stroke="#AAD3DF"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Tashkent City Artificial Lake */}
          <ellipse cx="375" cy="445" rx="25" ry="16" fill="#AAD3DF" stroke="#85B9CA" strokeWidth="1.5" />
        </g>

        {/* 6. Building Footprints (OSM #D9D0C9) */}
        <g fill="#D9D0C9" stroke="#C2B7AC" strokeWidth="0.8">
          {/* Hotel Uzbekistan (C-shape curved building) */}
          <path d="M 575,445 Q 590,480 575,515 L 565,510 Q 578,480 565,450 Z" />
          {/* Forum Palace (Oqsaroy) */}
          <rect x="520" y="530" width="30" height="25" rx="3" />
          {/* Navoiy Opera Theater */}
          <rect x="460" y="550" width="28" height="24" rx="2" />
          {/* TsUM Department Store */}
          <rect x="430" y="570" width="35" height="20" rx="2" />
          {/* Tashkent City Skyscraper footprint */}
          <rect x="360" y="380" width="22" height="22" rx="2" />
          <rect x="390" y="375" width="20" height="24" rx="2" />
        </g>

        {/* 7. Secondary / Local Street Network (OSM #FFFFFF with #D1CECA casing) */}
        <g fill="none" stroke="#D1CECA" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          {/* Grid streets around center */}
          <line x1="100" y1="200" x2="900" y2="200" />
          <line x1="100" y1="320" x2="900" y2="320" />
          <line x1="100" y1="620" x2="900" y2="620" />
          <line x1="100" y1="740" x2="900" y2="740" />
          <line x1="220" y1="100" x2="220" y2="900" />
          <line x1="340" y1="100" x2="340" y2="900" />
          <line x1="680" y1="100" x2="680" y2="900" />
          <line x1="800" y1="100" x2="800" y2="900" />
        </g>
        <g fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="100" y1="200" x2="900" y2="200" />
          <line x1="100" y1="320" x2="900" y2="320" />
          <line x1="100" y1="620" x2="900" y2="620" />
          <line x1="100" y1="740" x2="900" y2="740" />
          <line x1="220" y1="100" x2="220" y2="900" />
          <line x1="340" y1="100" x2="340" y2="900" />
          <line x1="680" y1="100" x2="680" y2="900" />
          <line x1="800" y1="100" x2="800" y2="900" />
        </g>

        {/* 8. Primary Avenues & Trunks (OSM #FCD6A4 with #CFB799 casing) */}
        {/* Road Casings */}
        <g fill="none" stroke="#CFB799" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
          {/* Amir Temur shoh ko'chasi (North-South main spine) */}
          <line x1="530" y1="0" x2="530" y2="1000" />
          {/* Alisher Navoiy shoh ko'chasi (East-West spine) */}
          <line x1="0" y1="480" x2="1000" y2="480" />
          {/* Mustaqillik shoh ko'chasi (Northeast diagonal) */}
          <line x1="530" y1="480" x2="950" y2="200" />
          {/* Shahrisabz ko'chasi */}
          <line x1="430" y1="100" x2="620" y2="900" />
          {/* Islom Karimov shoh ko'chasi */}
          <line x1="200" y1="560" x2="850" y2="560" />
          {/* Afrosiyob ko'chasi */}
          <line x1="300" y1="660" x2="900" y2="660" />
          {/* Amir Temur Radial Outer Roundabout */}
          <circle cx="530" cy="480" r="48" />
        </g>

        {/* Road Fills (OSM Primary Orange/Yellow #FCD6A4 / #FFA06B) */}
        <g fill="none" stroke="#FCD6A4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="530" y1="0" x2="530" y2="1000" />
          <line x1="0" y1="480" x2="1000" y2="480" />
          <line x1="530" y1="480" x2="950" y2="200" stroke="#FFA06B" />
          <line x1="430" y1="100" x2="620" y2="900" />
          <line x1="200" y1="560" x2="850" y2="560" stroke="#FFA06B" />
          <line x1="300" y1="660" x2="900" y2="660" />
          <circle cx="530" cy="480" r="48" stroke="#FFA06B" />
        </g>

        {/* 9. OSM Typography Labels (Clean, unobtrusive map labels) */}
        <g fill="#70685E" fontFamily="sans-serif" fontSize="11" fontWeight="600" opacity="0.85">
          {/* Street Labels */}
          <text x="536" y="260" transform="rotate(90 536,260)">
            Amir Temur shoh ko'chasi
          </text>
          <text x="536" y="760" transform="rotate(90 536,760)">
            Amir Temur shoh ko'chasi
          </text>
          <text x="180" y="474">
            Alisher Navoiy shoh ko'chasi
          </text>
          <text x="700" y="474">
            Taras Shevchenko ko'chasi
          </text>
          <text x="650" y="320" transform="rotate(-33 650,320)">
            Mustaqillik shoh ko'chasi
          </text>
          <text x="440" y="554">
            Islom Karimov ko'chasi
          </text>
          <text x="600" y="654">
            Afrosiyob ko'chasi
          </text>

          {/* Landmark Text */}
          <text x="530" y="484" fill="#2563EB" fontSize="10" fontWeight="bold" textAnchor="middle">
            Amir Temur xiyoboni
          </text>
          <text x="495" y="482" fill="#504A42" fontSize="9" fontWeight="600" textAnchor="middle">
            Sayilgoh
          </text>
          <text x="375" y="468" fill="#16A34A" fontSize="9" fontWeight="bold" textAnchor="middle">
            Toshkent City
          </text>
          <text x="470" y="590" fill="#70685E" fontSize="9" fontWeight="600" textAnchor="middle">
            Navoiy teatri
          </text>
          <text x="315" y="350" fill="#3B82F6" fontSize="10" fontWeight="600" transform="rotate(78 315,350)">
            Anhor kanali
          </text>
        </g>

        {/* 10. Driving Route Path (When "YO'NALISH" is active) */}
        {isNavigating && (
          <g>
            {/* Route Casing / Shadow */}
            <path
              d={`M ${userSvgX},${userSvgY} L ${midX},${midY} L ${targetSvgX},${targetSvgY}`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Route Blue Line */}
            <path
              d={`M ${userSvgX},${userSvgY} L ${midX},${midY} L ${targetSvgX},${targetSvgY}`}
              fill="none"
              stroke="#2563EB"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 6"
              className="animate-pulse"
            />

            {/* Turn Waypoint Dot */}
            <circle cx={midX} cy={midY} r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        )}

        {/* 11. User Current GPS Location Marker */}
        <g transform={`translate(${userSvgX}, ${userSvgY})`}>
          {/* Animated GPS ping */}
          <circle r="22" fill="#2563EB" opacity="0.25" className="animate-ping" />
          {/* Outer white halo */}
          <circle r="11" fill="#FFFFFF" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          {/* Inner blue dot */}
          <circle r="8" fill="#2563EB" />
          <circle r="3" fill="#FFFFFF" />

          {/* Tooltip: "Sizning joylashuvingiz" */}
          <g transform="translate(0, -20)">
            <rect x="-55" y="-14" width="110" height="18" rx="5" fill="#0F172A" opacity="0.85" />
            <text x="0" y="-1" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
              Siz bu yerdasiz
            </text>
          </g>
        </g>

        {/* 12. Colored Parking Pins (Green, Yellow, Red) */}
        {filteredZones.map((zone) => {
          const pinX = (zone.coordinates.x / 100) * mapWidth;
          const pinY = (zone.coordinates.y / 100) * mapHeight;
          const isSelected = selectedZone.id === zone.id;
          const statusCfg = STATUS_CONFIG[zone.status];
          const freeCount = zone.totalSpots - zone.occupiedSpots;

          return (
            <g
              key={zone.id}
              transform={`translate(${pinX}, ${pinY})`}
              className="cursor-pointer transition-transform duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onSelectZone(zone);
              }}
            >
              {/* Selected Pin Halo Pulse */}
              {isSelected && (
                <circle
                  r="30"
                  fill={statusCfg.color}
                  opacity="0.25"
                  className="animate-ping"
                />
              )}

              {/* Pin Drop Shadow */}
              <ellipse cx="0" cy="5" rx="10" ry="4" fill="rgba(0,0,0,0.25)" filter="blur(1.5px)" />

              {/* Teardrop Marker Body (OpenStreetMap modern pin) */}
              <path
                d="M 0,0 C -14,-14 -18,-24 -18,-34 C -18,-45 -9,-54 0,-54 C 9,-54 18,-45 18,-34 C 18,-24 14,-14 0,0 Z"
                fill={statusCfg.color}
                stroke="#FFFFFF"
                strokeWidth={isSelected ? '2.5' : '1.8'}
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))"
                transform={isSelected ? 'scale(1.15) translate(0, 4)' : 'scale(1)'}
              />

              {/* White badge inner circle */}
              <circle
                cx="0"
                cy={isSelected ? -35 : -34}
                r={isSelected ? 10 : 8.5}
                fill="#FFFFFF"
              />

              {/* Pin Text: "P" or free count */}
              <text
                x="0"
                y={isSelected ? -31 : -30.5}
                textAnchor="middle"
                fill={statusCfg.color}
                fontSize={isSelected ? '10' : '9'}
                fontWeight="900"
                fontFamily="sans-serif"
                className="select-none"
              >
                P
              </text>

              {/* Free spots label above pin */}
              <g transform="translate(0, -60)">
                <rect
                  x="-28"
                  y="-14"
                  width="56"
                  height="16"
                  rx="4"
                  fill="#FFFFFF"
                  stroke={statusCfg.color}
                  strokeWidth="1.2"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                />
                <text
                  x="0"
                  y="-2.5"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {freeCount > 0 ? `${freeCount} bo'sh` : "To'la"}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Floating Map Utility Controls */}
      <div className="absolute top-20 right-4 flex flex-col gap-2 z-20">
        {/* Zoom In */}
        <button
          onClick={() => setZoom((z) => Math.min(2.2, z + 0.25))}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Kattalashtirish"
          aria-label="Kattalashtirish"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => setZoom((z) => Math.max(0.7, z - 0.25))}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Kichiklashtirish"
          aria-label="Kichiklashtirish"
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Recenter Location Button */}
        <button
          onClick={() => {
            setPan({ x: 0, y: 0 });
            setZoom(1.1);
          }}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-[#2563EB] hover:bg-blue-50 transition-colors"
          title="Mening joylashuvim"
          aria-label="Mening joylashuvim"
        >
          <Navigation2 className="w-4 h-4 fill-current rotate-45" />
        </button>
      </div>

      {/* OSM Official Style Copyright Badge */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] text-slate-500 font-sans pointer-events-none border border-slate-200/60">
        © <span className="font-semibold text-slate-700">OpenStreetMap</span> hissa qo'shuvchilari · Toshkent markazi
      </div>
    </div>
  );
};
