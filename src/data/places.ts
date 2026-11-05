import { LatLng, haversineMeters } from '../utils/geo';

export interface Place {
  id: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  kind: 'district' | 'landmark';
}

// Toshkentning 12 ta tumani (taxminiy markaz koordinatalari)
export const TASHKENT_DISTRICTS: Place[] = [
  { id: 'd-bektemir', name: 'Bektemir tumani', subtitle: 'Toshkent', lat: 41.2165, lng: 69.3345, kind: 'district' },
  { id: 'd-chilonzor', name: 'Chilonzor tumani', subtitle: 'Toshkent', lat: 41.2755, lng: 69.2040, kind: 'district' },
  { id: 'd-mirobod', name: 'Mirobod tumani', subtitle: 'Toshkent', lat: 41.2985, lng: 69.2720, kind: 'district' },
  { id: 'd-mirzo-ulugbek', name: "Mirzo Ulug'bek tumani", subtitle: 'Toshkent', lat: 41.3385, lng: 69.3340, kind: 'district' },
  { id: 'd-olmazor', name: 'Olmazor tumani', subtitle: 'Toshkent', lat: 41.3450, lng: 69.2200, kind: 'district' },
  { id: 'd-sergeli', name: 'Sergeli tumani', subtitle: 'Toshkent', lat: 41.2270, lng: 69.2230, kind: 'district' },
  { id: 'd-shayxontohur', name: 'Shayxontohur tumani', subtitle: 'Toshkent', lat: 41.3235, lng: 69.2380, kind: 'district' },
  { id: 'd-uchtepa', name: 'Uchtepa tumani', subtitle: 'Toshkent', lat: 41.2945, lng: 69.1620, kind: 'district' },
  { id: 'd-yakkasaroy', name: 'Yakkasaroy tumani', subtitle: 'Toshkent', lat: 41.2900, lng: 69.2560, kind: 'district' },
  { id: 'd-yangihayot', name: 'Yangihayot tumani', subtitle: 'Toshkent', lat: 41.2470, lng: 69.1330, kind: 'district' },
  { id: 'd-yashnobod', name: 'Yashnobod tumani', subtitle: 'Toshkent', lat: 41.3040, lng: 69.3330, kind: 'district' },
  { id: 'd-yunusobod', name: 'Yunusobod tumani', subtitle: 'Toshkent', lat: 41.3640, lng: 69.2860, kind: 'district' },
];

// Mashhur joylar (foydalanuvchi o'z joylashuvini shu orqali ham tanlashi mumkin)
export const TASHKENT_LANDMARKS: Place[] = [
  { id: 'l-amir-temur', name: 'Amir Temur xiyoboni', subtitle: 'Mirobod tumani', lat: 41.3111, lng: 69.2797, kind: 'landmark' },
  { id: 'l-sayilgoh', name: 'Sayilgoh (Broadway)', subtitle: 'Mirobod tumani', lat: 41.3128, lng: 69.2738, kind: 'landmark' },
  { id: 'l-toshkent-city', name: 'Toshkent City Mall', subtitle: 'Shayxontohur tumani', lat: 41.3135, lng: 69.2440, kind: 'landmark' },
  { id: 'l-tsum', name: 'TsUM va Navoiy teatri', subtitle: 'Yakkasaroy tumani', lat: 41.3105, lng: 69.2665, kind: 'landmark' },
  { id: 'l-chorsu', name: 'Chorsu bozori', subtitle: 'Olmazor tumani', lat: 41.3262, lng: 69.2350, kind: 'landmark' },
  { id: 'l-oloy', name: 'Oloy bozori', subtitle: "Mirzo Ulug'bek tumani", lat: 41.3385, lng: 69.2864, kind: 'landmark' },
  { id: 'l-vokzal', name: 'Toshkent temir yo\'l vokzali', subtitle: 'Mirobod tumani', lat: 41.2925, lng: 69.2850, kind: 'landmark' },
  { id: 'l-airport', name: 'Toshkent xalqaro aeroporti', subtitle: 'Sergeli tumani', lat: 41.2579, lng: 69.2811, kind: 'landmark' },
  { id: 'l-magic-city', name: 'Magic City', subtitle: 'Yunusobod tumani', lat: 41.3400, lng: 69.2760, kind: 'landmark' },
  { id: 'l-minor', name: 'Minor masjidi', subtitle: 'Mirzo Ulug\'bek tumani', lat: 41.3365, lng: 69.2860, kind: 'landmark' },
];

export const ALL_PLACES: Place[] = [...TASHKENT_DISTRICTS, ...TASHKENT_LANDMARKS];

/** Berilgan nuqtaga eng yaqin tuman markazini qaytaradi. */
export function nearestDistrict(p: LatLng): Place {
  let best = TASHKENT_DISTRICTS[0];
  let bestD = Infinity;
  for (const d of TASHKENT_DISTRICTS) {
    const dist = haversineMeters(p, d);
    if (dist < bestD) {
      bestD = dist;
      best = d;
    }
  }
  return best;
}
