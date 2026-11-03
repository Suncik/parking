import { ParkingZone, ParkingSpot } from '../types';

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

export const TASHKENT_PARKING_ZONES: ParkingZone[] = [
  {
    id: 'parking-1',
    codeNumber: 1,
    displayName: 'Parking #1',
    name: 'Amir Temur xiyoboni',
    district: 'Mirobod tumani',
    address: 'Amir Temur shoh ko\'chasi, 2',
    distance: '1.2 km',
    distanceMeters: 1200,
    hourlyRate: 5000,
    totalSpots: 50,
    occupiedSpots: 36, // 14 free -> exact user prompt: "Bo'sh joy: 14 / 50"
    status: 'warning', // 🟡 Deyarli to'la
    image: '/src/assets/images/tashkent_city_parking_1793683851093.jpg',
    coordinates: { x: 53, y: 48 }, // Amir Temur circle in Tashkent Center
    features: ['Shahar markazi', 'Kamera nazorati', 'Yopiq yer osti', '24/7 rejim'],
    operatingHours: '24/7 uzluksiz',
    spots: generateSpots('parking-1', 50, 14),
  },
  {
    id: 'parking-2',
    codeNumber: 2,
    displayName: 'Parking #2',
    name: 'TsUM va Navoiy teatri',
    district: 'Yakkasaroy tumani',
    address: 'Zarafshon ko\'chasi, 10',
    distance: '0.8 km',
    distanceMeters: 800,
    hourlyRate: 6000,
    totalSpots: 40,
    occupiedSpots: 16, // 24 free
    status: 'free', // 🟢 Bo'sh parking
    image: '/src/assets/images/ecopark_smart_parking_1793683851934.jpg',
    coordinates: { x: 47, y: 56 }, // Near TSUM and Broadway
    features: ['Teatr oldida', 'EV quvvatlash', 'Soyabonli joylar', 'Nogironlar joyi'],
    operatingHours: '07:00 – 23:00',
    spots: generateSpots('parking-2', 40, 24),
  },
  {
    id: 'parking-3',
    codeNumber: 3,
    displayName: 'Parking #3',
    name: 'Toshkent City Park & Mall',
    district: 'Shayxontohur tumani',
    address: 'Botir Zokirov ko\'chasi, 7',
    distance: '2.1 km',
    distanceMeters: 2100,
    hourlyRate: 8000,
    totalSpots: 250,
    occupiedSpots: 162, // 88 free
    status: 'free', // 🟢 Bo'sh parking
    image: '/src/assets/images/tashkent_city_parking_1793683851093.jpg',
    coordinates: { x: 38, y: 44 }, // Tashkent City area
    features: ['Elektr quvvatlash (EV)', 'Katta yer osti kompleksi', 'Avtomatik to\'lov', '24/7 ochiq'],
    operatingHours: '24/7 uzluksiz',
    spots: generateSpots('parking-3', 250, 88),
  },
  {
    id: 'parking-4',
    codeNumber: 4,
    displayName: 'Parking #4',
    name: 'Sayilgoh / Broadway',
    district: 'Mirobod tumani',
    address: 'Sayilgoh ko\'chasi, 15',
    distance: '0.5 km',
    distanceMeters: 500,
    hourlyRate: 7000,
    totalSpots: 30,
    occupiedSpots: 24, // 6 free
    status: 'warning', // 🟡 Deyarli to'la
    image: '/src/assets/images/chorsu_open_parking_1793683851749.jpg',
    coordinates: { x: 49, y: 47 }, // Broadway
    features: ['Piyodalar yo\'lagi yaqinida', 'Qo\'riqlash', 'Shinam yoritish'],
    operatingHours: '08:00 – 01:00',
    spots: generateSpots('parking-4', 30, 6),
  },
  {
    id: 'parking-5',
    codeNumber: 5,
    displayName: 'Parking #5',
    name: 'Oloy Bozori & Biznes',
    district: 'Mirzo Ulug\'bek tumani',
    address: 'Amir Temur shoh ko\'chasi, 42',
    distance: '1.7 km',
    distanceMeters: 1700,
    hourlyRate: 5000,
    totalSpots: 60,
    occupiedSpots: 60, // 0 free
    status: 'full', // 🔴 Bo'sh joy yo'q
    image: '/src/assets/images/chorsu_open_parking_1793683851749.jpg',
    coordinates: { x: 57, y: 35 }, // North on Amir Temur
    features: ['Bozor hududi', 'Kamera nazorati', 'Qisqa muddatli to\'xtash'],
    operatingHours: '06:00 – 22:00',
    spots: generateSpots('parking-5', 60, 0),
  },
  {
    id: 'parking-6',
    codeNumber: 6,
    displayName: 'Parking #6',
    name: 'Chorsu Bozori',
    district: 'Olmazor tumani',
    address: 'Zarqaynar ko\'chasi, 14',
    distance: '3.2 km',
    distanceMeters: 3200,
    hourlyRate: 4000,
    totalSpots: 80,
    occupiedSpots: 80, // 0 free
    status: 'full', // 🔴 Bo'sh joy yo'q
    image: '/src/assets/images/chorsu_open_parking_1793683851749.jpg',
    coordinates: { x: 26, y: 32 }, // Chorsu dome area
    features: ['Eski shahar', 'Keng maydon', 'Shlagbaum'],
    operatingHours: '06:00 – 22:00',
    spots: generateSpots('parking-6', 80, 0),
  },
  {
    id: 'parking-7',
    codeNumber: 7,
    displayName: 'Parking #7',
    name: 'Oybek Metro va Biznes',
    district: 'Yakkasaroy tumani',
    address: 'Afrosiyob ko\'chasi, 4B',
    distance: '1.9 km',
    distanceMeters: 1900,
    hourlyRate: 6000,
    totalSpots: 70,
    occupiedSpots: 38, // 32 free
    status: 'free', // 🟢 Bo'sh parking
    image: '/src/assets/images/ecopark_smart_parking_1793683851934.jpg',
    coordinates: { x: 56, y: 64 }, // South on Afrosiyob
    features: ['Metro bekatiga 50m', 'Yer osti', 'Payme/Click terminali'],
    operatingHours: '07:00 – 23:00',
    spots: generateSpots('parking-7', 70, 32),
  },
  {
    id: 'parking-8',
    codeNumber: 8,
    displayName: 'Parking #8',
    name: 'Ecopark TsUM',
    district: 'Mirzo Ulug\'bek tumani',
    address: 'Makhtumquli ko\'chasi, 79',
    distance: '2.6 km',
    distanceMeters: 2600,
    hourlyRate: 6000,
    totalSpots: 100,
    occupiedSpots: 55, // 45 free
    status: 'free', // 🟢 Bo'sh parking
    image: '/src/assets/images/ecopark_smart_parking_1793683851934.jpg',
    coordinates: { x: 67, y: 44 }, // East
    features: ['Yashil park hududi', 'Quyosh panellari', 'EV zaryadka'],
    operatingHours: '24/7 uzluksiz',
    spots: generateSpots('parking-8', 100, 45),
  },
];

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
