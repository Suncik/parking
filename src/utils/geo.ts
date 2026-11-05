export interface LatLng {
  lat: number;
  lng: number;
}

// Toshkent shahri markazi (Amir Temur xiyoboni)
export const TASHKENT_CENTER: LatLng = { lat: 41.3111, lng: 69.2797 };

// Shahar atrofidagi taxminiy chegara (km). Undan tashqaridagi GPS natijasi ishonchsiz deb hisoblanadi.
export const TASHKENT_RADIUS_KM = 45;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Ikki nuqta orasidagi masofa (metrda), Haversine formulasi. */
export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** 850 -> "850 m", 1234 -> "1.2 km" */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.max(10, Math.round(meters / 10) * 10)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function isInsideTashkent(p: LatLng): boolean {
  return haversineMeters(p, TASHKENT_CENTER) <= TASHKENT_RADIUS_KM * 1000;
}

/** Qidiruv uchun matnni soddalashtiradi: kichik harf, apostrof belgilarsiz. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ʻʼ'’`‘´]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
