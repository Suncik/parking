import { ParkingZone, ParkingSpot, ParkingStatus } from '../types';
import type { ParkingApplication } from '../utils/applicationsStore';

const generateSpots = (zoneId: string, total: number, freeCount: number): ParkingSpot[] => {
  const spots: ParkingSpot[] = [];
  const floors = ['1-qavat', '-1 qavat'];
  const plates = ['01 A 777 AA', '01 010 RAA', '01 555 UZB', '01 888 MBA', '10 B 345 CC', '01 909 TAS'];

  const occupiedCount = total - freeCount;

  for (let i = 1; i <= total; i++) {
    const isOccupied = i <= occupiedCount;
    const isEv = i % 7 === 0;
    const isDisabled = i === 1 || i === 2;
    const code = `A-${i.toString().padStart(2, '0')}`;

    spots.push({
      id: `${zoneId}-spot-${i}`,
      code,
      floor: floors[i % floors.length],
      type: isEv ? 'ev' : isDisabled ? 'disabled' : 'standard',
      status: isOccupied ? 'occupied' : 'free',
      vehiclePlate: isOccupied ? plates[i % plates.length] : undefined,
    });
  }
  return spots;
};

const IMG_TASHKENT_CITY = '/src/assets/images/tashkent_city_parking_1793683851093.jpg';
const IMG_ECOPARK = '/src/assets/images/ecopark_smart_parking_1793683851934.jpg';
const IMG_CHORSU = '/src/assets/images/chorsu_open_parking_1793683851749.jpg';

// Eski sxematik xarita (foizli koordinatalar) uchun: lat/lng dan taxminiy x,y hisoblanadi.
const toLegacyXY = (lat: number, lng: number) => ({
  x: Math.round(Math.min(100, Math.max(0, ((lng - 69.1) / 0.28) * 100))),
  y: Math.round(Math.min(100, Math.max(0, ((41.4 - lat) / 0.22) * 100))),
});

const autoStatus = (total: number, free: number): ParkingStatus => {
  if (free <= 0) return 'full';
  if (free / total < 0.2) return 'warning';
  return 'free';
};

interface ZoneInput {
  n: number; // Parking raqami
  name: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  rate: number;
  total: number;
  free: number;
  image: string;
  features: string[];
  hours: string;
  status?: ParkingStatus; // ixtiyoriy: avtomatik hisoblanmasa
}

const makeZone = (z: ZoneInput): ParkingZone => {
  const id = `parking-${z.n}`;
  return {
    id,
    codeNumber: z.n,
    displayName: `Parking #${z.n}`,
    name: z.name,
    district: z.district,
    address: z.address,
    // distance / distanceMeters foydalanuvchi joylashuvidan App ichida qayta hisoblanadi
    distance: '—',
    distanceMeters: 0,
    hourlyRate: z.rate,
    totalSpots: z.total,
    occupiedSpots: z.total - z.free,
    status: z.status ?? autoStatus(z.total, z.free),
    image: z.image,
    lat: z.lat,
    lng: z.lng,
    coordinates: toLegacyXY(z.lat, z.lng),
    features: z.features,
    operatingHours: z.hours,
    spots: generateSpots(id, z.total, z.free),
  };
};

// Diqqat: manzillar va koordinatalar namunaviy (demo) ma'lumotlar. Real tizimda backend'dan olinadi.
export const TASHKENT_PARKING_ZONES: ParkingZone[] = [
  // ───── Markaziy hududlar (mavjud parkinglar) ─────
  makeZone({
    n: 1, name: 'Amir Temur xiyoboni', district: 'Mirobod tumani', address: "Amir Temur shoh ko'chasi, 2",
    lat: 41.3111, lng: 69.2797, rate: 5000, total: 50, free: 14, status: 'warning', image: IMG_TASHKENT_CITY,
    features: ['Shahar markazi', 'Kamera nazorati', 'Yopiq yer osti', '24/7 rejim'], hours: '24/7 uzluksiz',
  }),
  makeZone({
    n: 2, name: 'TsUM va Navoiy teatri', district: 'Yakkasaroy tumani', address: "Zarafshon ko'chasi, 10",
    lat: 41.3105, lng: 69.2665, rate: 6000, total: 40, free: 24, status: 'free', image: IMG_ECOPARK,
    features: ['Teatr oldida', 'EV quvvatlash', 'Soyabonli joylar', 'Nogironlar joyi'], hours: '07:00 – 23:00',
  }),
  makeZone({
    n: 3, name: 'Toshkent City Park & Mall', district: 'Shayxontohur tumani', address: "Botir Zokirov ko'chasi, 7",
    lat: 41.3135, lng: 69.2440, rate: 8000, total: 250, free: 88, status: 'free', image: IMG_TASHKENT_CITY,
    features: ['Elektr quvvatlash (EV)', 'Katta yer osti kompleksi', "Avtomatik to'lov", '24/7 ochiq'], hours: '24/7 uzluksiz',
  }),
  makeZone({
    n: 4, name: 'Sayilgoh / Broadway', district: 'Mirobod tumani', address: "Sayilgoh ko'chasi, 15",
    lat: 41.3128, lng: 69.2738, rate: 7000, total: 30, free: 6, status: 'warning', image: IMG_CHORSU,
    features: ["Piyodalar yo'lagi yaqinida", "Qo'riqlash", 'Shinam yoritish'], hours: '08:00 – 01:00',
  }),
  makeZone({
    n: 5, name: 'Oloy Bozori & Biznes', district: "Mirzo Ulug'bek tumani", address: "Amir Temur shoh ko'chasi, 42",
    lat: 41.3385, lng: 69.2864, rate: 5000, total: 60, free: 0, status: 'full', image: IMG_CHORSU,
    features: ['Bozor hududi', 'Kamera nazorati', "Qisqa muddatli to'xtash"], hours: '06:00 – 22:00',
  }),
  makeZone({
    n: 6, name: 'Chorsu Bozori', district: 'Olmazor tumani', address: "Zarqaynar ko'chasi, 14",
    lat: 41.3262, lng: 69.2350, rate: 4000, total: 80, free: 0, status: 'full', image: IMG_CHORSU,
    features: ['Eski shahar', 'Keng maydon', 'Shlagbaum'], hours: '06:00 – 22:00',
  }),
  makeZone({
    n: 7, name: 'Oybek Metro va Biznes', district: 'Yakkasaroy tumani', address: "Afrosiyob ko'chasi, 4B",
    lat: 41.2988, lng: 69.2745, rate: 6000, total: 70, free: 32, status: 'free', image: IMG_ECOPARK,
    features: ['Metro bekatiga 50m', 'Yer osti', 'Payme/Click terminali'], hours: '07:00 – 23:00',
  }),
  makeZone({
    n: 8, name: 'Ecopark TsUM', district: "Mirzo Ulug'bek tumani", address: "Makhtumquli ko'chasi, 79",
    lat: 41.3260, lng: 69.2990, rate: 6000, total: 100, free: 45, status: 'free', image: IMG_ECOPARK,
    features: ['Yashil park hududi', 'Quyosh panellari', 'EV zaryadka'], hours: '24/7 uzluksiz',
  }),

  // ───── Yunusobod tumani ─────
  makeZone({
    n: 9, name: 'Yunusobod 4-kvartal', district: 'Yunusobod tumani', address: "Amir Temur shoh ko'chasi, 108",
    lat: 41.3640, lng: 69.2870, rate: 5000, total: 90, free: 41, image: IMG_ECOPARK,
    features: ['Turar joy hududi', 'Kamera nazorati', 'Yoritilgan'], hours: '24/7 uzluksiz',
  }),
  makeZone({
    n: 10, name: 'Yunusobod bozori', district: 'Yunusobod tumani', address: "Ahmad Donish ko'chasi, 12",
    lat: 41.3665, lng: 69.2960, rate: 4000, total: 70, free: 9, image: IMG_CHORSU,
    features: ['Bozor yaqinida', "Qo'riqlash", 'Ochiq maydon'], hours: '06:00 – 21:00',
  }),
  makeZone({
    n: 11, name: 'Magic City', district: 'Yunusobod tumani', address: "Bobur ko'chasi, 1",
    lat: 41.3400, lng: 69.2760, rate: 9000, total: 180, free: 76, image: IMG_TASHKENT_CITY,
    features: ["Ko'ngilochar markaz", 'Yer osti', 'EV quvvatlash'], hours: '10:00 – 02:00',
  }),

  // ───── Chilonzor tumani ─────
  makeZone({
    n: 12, name: 'Chilonzor 7-kvartal', district: 'Chilonzor tumani', address: "Bunyodkor shoh ko'chasi, 21",
    lat: 41.2755, lng: 69.2060, rate: 4000, total: 120, free: 63, image: IMG_ECOPARK,
    features: ['Turar joy hududi', 'Kamera nazorati', 'Katta maydon'], hours: '24/7 uzluksiz',
  }),
  makeZone({
    n: 13, name: 'Chilonzor metro', district: 'Chilonzor tumani', address: "Muqimiy ko'chasi, 3",
    lat: 41.2840, lng: 69.2040, rate: 5000, total: 60, free: 0, image: IMG_CHORSU,
    features: ['Metro bekati yonida', 'Soyabonli joylar'], hours: '06:00 – 23:00',
  }),
  makeZone({
    n: 14, name: 'Qatortol bozori', district: 'Chilonzor tumani', address: "Qatortol ko'chasi, 60",
    lat: 41.2680, lng: 69.1980, rate: 3500, total: 80, free: 52, image: IMG_CHORSU,
    features: ['Bozor yaqinida', 'Ochiq maydon'], hours: '06:00 – 21:00',
  }),

  // ───── Yashnobod tumani ─────
  makeZone({
    n: 15, name: 'Yashnobod bozori', district: 'Yashnobod tumani', address: "Yangi Yo'l ko'chasi, 25",
    lat: 41.3040, lng: 69.3320, rate: 4000, total: 100, free: 18, image: IMG_CHORSU,
    features: ['Bozor yaqinida', "Qo'riqlash"], hours: '06:00 – 22:00',
  }),
  makeZone({
    n: 16, name: 'Tinchlik metro', district: 'Yashnobod tumani', address: "Tinchlik ko'chasi, 8",
    lat: 41.3115, lng: 69.3480, rate: 4500, total: 55, free: 30, image: IMG_ECOPARK,
    features: ['Metro bekati yonida', 'Kamera nazorati'], hours: '06:00 – 23:00',
  }),

  // ───── Sergeli tumani ─────
  makeZone({
    n: 17, name: 'Sergeli Dehqon bozori', district: 'Sergeli tumani', address: "Sergeli ko'chasi, 40",
    lat: 41.2250, lng: 69.2230, rate: 3000, total: 150, free: 97, image: IMG_CHORSU,
    features: ['Katta ochiq maydon', 'Bozor yaqinida'], hours: '05:00 – 21:00',
  }),
  makeZone({
    n: 18, name: 'Yangi Sergeli', district: 'Sergeli tumani', address: "Yangi Sergeli ko'chasi, 5",
    lat: 41.2330, lng: 69.2150, rate: 3500, total: 70, free: 11, image: IMG_ECOPARK,
    features: ['Turar joy hududi', 'Yoritilgan'], hours: '24/7 uzluksiz',
  }),

  // ───── Bektemir tumani ─────
  makeZone({
    n: 19, name: 'Bektemir sanoat hududi', district: 'Bektemir tumani', address: "Bektemir ko'chasi, 12",
    lat: 41.2165, lng: 69.3345, rate: 3000, total: 120, free: 85, image: IMG_CHORSU,
    features: ['Yuk mashinalari uchun', 'Shlagbaum', 'Katta maydon'], hours: '24/7 uzluksiz',
  }),

  // ───── Uchtepa tumani ─────
  makeZone({
    n: 20, name: 'Uchtepa markazi', district: 'Uchtepa tumani', address: "Fargona yo'li ko'chasi, 58",
    lat: 41.2945, lng: 69.1620, rate: 3500, total: 90, free: 44, image: IMG_ECOPARK,
    features: ['Kamera nazorati', 'Yoritilgan'], hours: '06:00 – 23:00',
  }),
  makeZone({
    n: 21, name: 'Uchtepa Gulbahor', district: 'Uchtepa tumani', address: "Gulbahor ko'chasi, 9",
    lat: 41.3030, lng: 69.1730, rate: 3500, total: 60, free: 6, image: IMG_CHORSU,
    features: ['Turar joy hududi', "Qo'riqlash"], hours: '24/7 uzluksiz',
  }),

  // ───── Yangihayot tumani ─────
  makeZone({
    n: 22, name: 'Yangihayot markazi', district: 'Yangihayot tumani', address: "Yangihayot ko'chasi, 3",
    lat: 41.2470, lng: 69.1330, rate: 3000, total: 80, free: 60, image: IMG_CHORSU,
    features: ['Ochiq maydon', 'Kamera nazorati'], hours: '06:00 – 22:00',
  }),

  // ───── Olmazor tumani ─────
  makeZone({
    n: 23, name: 'Olmazor Beruniy', district: 'Olmazor tumani', address: "Beruniy ko'chasi, 30",
    lat: 41.3450, lng: 69.2200, rate: 4500, total: 70, free: 28, image: IMG_ECOPARK,
    features: ['Metro yaqinida', 'Kamera nazorati'], hours: '06:00 – 23:00',
  }),
  makeZone({
    n: 24, name: 'Universitet (TDTU) oldi', district: 'Olmazor tumani', address: "Universitet ko'chasi, 2",
    lat: 41.3395, lng: 69.2050, rate: 4000, total: 100, free: 0, image: IMG_CHORSU,
    features: ['Universitet hududi', "Qisqa muddatli to'xtash"], hours: '07:00 – 21:00',
  }),

  // ───── Shayxontohur tumani ─────
  makeZone({
    n: 25, name: "G'afur G'ulom metro", district: 'Shayxontohur tumani', address: "Navoiy ko'chasi, 66",
    lat: 41.3240, lng: 69.2145, rate: 4500, total: 65, free: 35, image: IMG_ECOPARK,
    features: ['Metro bekati yonida', 'Soyabonli joylar'], hours: '06:00 – 23:00',
  }),
  makeZone({
    n: 26, name: 'Shayxontohur Eski shahar', district: 'Shayxontohur tumani', address: "Navoiy ko'chasi, 120",
    lat: 41.3330, lng: 69.2420, rate: 5000, total: 45, free: 7, image: IMG_CHORSU,
    features: ['Tarixiy markaz', "Qo'riqlash"], hours: '07:00 – 22:00',
  }),

  // ───── Mirzo Ulug'bek tumani ─────
  makeZone({
    n: 27, name: "Mirzo Ulug'bek metro", district: "Mirzo Ulug'bek tumani", address: "Mirzo Ulug'bek ko'chasi, 77",
    lat: 41.3390, lng: 69.3340, rate: 4500, total: 85, free: 49, image: IMG_ECOPARK,
    features: ['Metro bekati yonida', 'Kamera nazorati'], hours: '06:00 – 23:00',
  }),
  makeZone({
    n: 28, name: 'Minor masjidi', district: "Mirzo Ulug'bek tumani", address: "Minor ko'chasi, 1",
    lat: 41.3365, lng: 69.2860, rate: 5000, total: 60, free: 12, image: IMG_TASHKENT_CITY,
    features: ["Ziyoratgoh yaqinida", 'Yoritilgan'], hours: '05:00 – 23:00',
  }),

  // ───── Mirobod va Yakkasaroy tumanlari ─────
  makeZone({
    n: 29, name: 'Toshkent temir yo\'l vokzali', district: 'Mirobod tumani', address: "Turkiston ko'chasi, 7",
    lat: 41.2925, lng: 69.2850, rate: 5000, total: 110, free: 22, image: IMG_ECOPARK,
    features: ['Vokzal yonida', '24/7 rejim', 'Kamera nazorati'], hours: '24/7 uzluksiz',
  }),
  makeZone({
    n: 30, name: 'Yakkasaroy Shota Rustaveli', district: 'Yakkasaroy tumani', address: "Shota Rustaveli ko'chasi, 45",
    lat: 41.2900, lng: 69.2560, rate: 5500, total: 50, free: 3, image: IMG_CHORSU,
    features: ['Turar joy hududi', "Qo'riqlash"], hours: '24/7 uzluksiz',
  }),
  makeZone({
    n: 31, name: 'Toshkent xalqaro aeroporti', district: 'Sergeli tumani', address: "Aeroport ko'chasi, 1",
    lat: 41.2579, lng: 69.2811, rate: 8000, total: 300, free: 120, image: IMG_TASHKENT_CITY,
    features: ['Aeroport terminali', 'Avtomatik to\'lov', '24/7 ochiq'], hours: '24/7 uzluksiz',
  }),
];

/** Faollashtirilgan egasi arizasidan haydovchilarga ko'rinadigan parking yaratadi. */
export const buildOwnerZone = (app: ParkingApplication, index: number): ParkingZone => {
  const n = 100 + index;
  const z = makeZone({
    n,
    name: app.parkingName,
    district: app.district,
    address: app.address,
    lat: app.lat,
    lng: app.lng,
    rate: app.hourlyRate,
    total: app.spots,
    free: app.spots, // yangi parking: hamma o'rin bo'sh (sensorlar real holatni yangilaydi)
    image: IMG_ECOPARK,
    features: ['Sensor: avtomatik holat', app.company],
    hours: app.hours,
  });
  return { ...z, id: `owner-${app.id}` };
};

export const STATUS_CONFIG = {
  free: {
    label: "Bo'sh parking",
    color: '#16A34A',
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotEmoji: '🟢',
    badgeBg: '#F0FDF4',
    badgeText: '#16A34A',
    description: "Yetarli bo'sh joylar mavjud",
  },
  warning: {
    label: "Deyarli to'la",
    color: '#EAB308',
    bgClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotEmoji: '🟡',
    badgeBg: '#FEFCE8',
    badgeText: '#CA8A04',
    description: "Joylar kam qolgan (cheklangan)",
  },
  full: {
    label: "Bo'sh joy yo'q",
    color: '#DC2626',
    bgClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotEmoji: '🔴',
    badgeBg: '#FEF2F2',
    badgeText: '#DC2626',
    description: "Barcha joylar band",
  },
};
