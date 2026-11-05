import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ParkingZone, ParkingStatus, UserLocation } from '../../types';
import { STATUS_CONFIG } from '../../data/parkingData';
import { Plus, Minus, Navigation2, X, MapPin } from 'lucide-react';

interface MobileOSMMapProps {
  zones: ParkingZone[];
  selectedZone: ParkingZone;
  onSelectZone: (zone: ParkingZone) => void;
  isNavigating: boolean;
  filterStatus?: 'all' | ParkingStatus;
  mapCenterTrigger?: number; // timestamp: foydalanuvchi joylashuviga qaytish
  userLocation: UserLocation;
  /** true bo'lsa xaritaga bosilgan joy foydalanuvchi joylashuvi bo'ladi */
  isPickingLocation?: boolean;
  onPickLocation?: (lat: number, lng: number) => void;
  onCancelPick?: () => void;
}

const buildParkingIcon = (zone: ParkingZone, isSelected: boolean) => {
  const cfg = STATUS_CONFIG[zone.status];
  const free = zone.totalSpots - zone.occupiedSpots;
  const label = free > 0 ? `${free} bo'sh` : "To'la";
  const scale = isSelected ? 1.15 : 1;

  const html = `
    <div style="position:relative;width:60px;height:74px;transform:scale(${scale});transform-origin:30px 70px;">
      <div style="position:absolute;left:2px;top:0;width:56px;height:16px;border-radius:4px;background:#fff;border:1.2px solid ${cfg.color};
        box-shadow:0 2px 4px rgba(0,0,0,.12);font:700 9px/14px sans-serif;color:#0F172A;text-align:center;white-space:nowrap;">${label}</div>
      <svg width="40" height="52" viewBox="-20 -56 40 58" style="position:absolute;left:10px;top:20px;filter:drop-shadow(0 4px 6px rgba(0,0,0,.25));overflow:visible">
        <path d="M 0,0 C -14,-14 -18,-24 -18,-34 C -18,-45 -9,-54 0,-54 C 9,-54 18,-45 18,-34 C 18,-24 14,-14 0,0 Z"
          fill="${cfg.color}" stroke="#fff" stroke-width="${isSelected ? 2.5 : 1.8}" />
        <circle cx="0" cy="-34" r="${isSelected ? 10 : 8.5}" fill="#fff" />
        <text x="0" y="-30.5" text-anchor="middle" fill="${cfg.color}" font-size="${isSelected ? 11 : 10}" font-weight="900" font-family="sans-serif">P</text>
      </svg>
    </div>`;

  return L.divIcon({
    className: 'sp-marker',
    html,
    iconSize: [60, 74],
    iconAnchor: [30, 72],
  });
};

const buildUserIcon = () =>
  L.divIcon({
    className: 'sp-marker',
    html: `
      <div style="position:relative;width:24px;height:24px;">
        <div style="position:absolute;inset:-14px;border-radius:50%;background:#2563EB;opacity:.22;animation:sp-ping 1.6s cubic-bezier(0,0,.2,1) infinite;"></div>
        <div style="position:absolute;inset:0;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:#2563EB;"></div>
        <div style="position:absolute;inset:9px;border-radius:50%;background:#fff;"></div>
        <div style="position:absolute;left:50%;bottom:30px;transform:translateX(-50%);background:rgba(15,23,42,.88);color:#fff;
          font:700 9px/16px sans-serif;padding:0 8px;border-radius:5px;white-space:nowrap;">Siz bu yerdasiz</div>
      </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

export const MobileOSMMap: React.FC<MobileOSMMapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  isNavigating,
  filterStatus = 'all',
  mapCenterTrigger = 0,
  userLocation,
  isPickingLocation = false,
  onPickLocation,
  onCancelPick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const parkingLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Callback'larning eng so'nggi qiymatlari (xarita bir marta yaratiladi)
  const pickingRef = useRef(isPickingLocation);
  const onPickRef = useRef(onPickLocation);
  const onSelectRef = useRef(onSelectZone);
  pickingRef.current = isPickingLocation;
  onPickRef.current = onPickLocation;
  onSelectRef.current = onSelectZone;

  // 1) Xaritani yaratish (bir marta)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    parkingLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    // Xaritadan joy tanlash rejimi
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (pickingRef.current && onPickRef.current) {
        onPickRef.current(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;
    // Konteyner o'lchami o'zgargandan keyin xaritani to'g'rilash
    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapRef.current = null;
      parkingLayerRef.current = null;
      routeLayerRef.current = null;
      userMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Foydalanuvchi markeri (sudrab ham o'zgartirsa bo'ladi)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!userMarkerRef.current) {
      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon: buildUserIcon(),
        draggable: true,
        zIndexOffset: 1000,
        title: 'Joylashuvingiz (sudrab o\'zgartirish mumkin)',
      }).addTo(map);
      marker.on('dragend', () => {
        const p = marker.getLatLng();
        onPickRef.current?.(p.lat, p.lng);
      });
      userMarkerRef.current = marker;
    } else {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation.lat, userLocation.lng]);

  // 3) Foydalanuvchi joyi o'zgarganda (GPS / qidiruv / xaritadan tanlash) xaritani shu yerga olib borish
  useEffect(() => {
    const map = mapRef.current;
    if (!map || userLocation.source === 'loading') return;
    map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 14), { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation.lat, userLocation.lng, userLocation.source]);

  // 4) Parking markerlari
  useEffect(() => {
    const layer = parkingLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const visible = filterStatus === 'all' ? zones : zones.filter((z) => z.status === filterStatus);
    visible.forEach((zone) => {
      const isSelected = zone.id === selectedZone.id;
      const marker = L.marker([zone.lat, zone.lng], {
        icon: buildParkingIcon(zone, isSelected),
        zIndexOffset: isSelected ? 900 : 0,
        title: `${zone.displayName} — ${zone.name}`,
      });
      marker.on('click', () => {
        onSelectRef.current(zone);
      });
      marker.addTo(layer);
    });
  }, [zones, filterStatus, selectedZone.id]);

  // 5) Tanlangan parkingga o'tish
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([selectedZone.lat, selectedZone.lng], Math.max(map.getZoom(), 15), { duration: 0.7 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone.id]);

  // 6) Yo'nalish chizig'i
  useEffect(() => {
    const map = mapRef.current;
    const layer = routeLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    if (!isNavigating) return;

    const from: L.LatLngTuple = [userLocation.lat, userLocation.lng];
    const to: L.LatLngTuple = [selectedZone.lat, selectedZone.lng];
    L.polyline([from, to], { color: '#FFFFFF', weight: 9, opacity: 0.95, lineCap: 'round' }).addTo(layer);
    L.polyline([from, to], { color: '#2563EB', weight: 5, dashArray: '8 8', lineCap: 'round' }).addTo(layer);
    map.fitBounds(L.latLngBounds([from, to]), { padding: [60, 60], maxZoom: 16 });
  }, [isNavigating, selectedZone.id, userLocation.lat, userLocation.lng]);

  // 7) "Mening joylashuvim" tugmasi
  useEffect(() => {
    const map = mapRef.current;
    if (!map || mapCenterTrigger === 0) return;
    map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.7 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapCenterTrigger]);

  // Joy tanlash rejimida kursor o'zgaradi
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.style.cursor = isPickingLocation ? 'crosshair' : '';
  }, [isPickingLocation]);

  return (
    <div className="relative w-full h-full bg-[#F2EFE9] overflow-hidden select-none isolate">
      {/* Leaflet + OpenStreetMap */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Xaritadan joy tanlash ko'rsatmasi */}
      {isPickingLocation && (
        <div className="absolute top-32 left-4 right-20 z-20 bg-[#2563EB] text-white rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2 text-xs font-semibold">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="flex-1">Joylashuvingizni belgilash uchun xaritaga bosing</span>
          <button
            onClick={onCancelPick}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Bekor qilish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Map Utility Controls */}
      <div className="absolute top-32 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Kattalashtirish"
          aria-label="Kattalashtirish"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Kichiklashtirish"
          aria-label="Kichiklashtirish"
        >
          <Minus className="w-5 h-5" />
        </button>

        <button
          onClick={() => mapRef.current?.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.7 })}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-[#2563EB] hover:bg-blue-50 transition-colors"
          title="Mening joylashuvim"
          aria-label="Mening joylashuvim"
        >
          <Navigation2 className="w-4 h-4 fill-current rotate-45" />
        </button>
      </div>
    </div>
  );
};
