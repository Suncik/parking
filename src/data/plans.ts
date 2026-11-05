export type PlanId = 'basic' | 'pro' | 'business';

/** Parking egalari uchun oylik tarif (obuna). */
export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number; // so'm / oy
  maxParkings: number | null; // null = cheksiz
  maxSpots: number | null; // barcha parkinglar bo'yicha jami o'rinlar; null = cheksiz
  bookingCommissionRate: number; // har bir band qilishdan platforma komissiyasi
  features: string[];
}

// Narxlar va limitlar namunaviy (demo). Haqiqiy qiymatlarni biznes qaroriga ko'ra belgilang.
export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Kichik parking uchun',
    priceMonthly: 99_000,
    maxParkings: 1,
    maxSpots: 50,
    bookingCommissionRate: 0.05,
    features: ["1 ta parking, 50 tagacha o'rin", 'Komissiya 5%', 'Oddiy hisobotlar'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: "O'rta va yirik parkinglar uchun",
    priceMonthly: 299_000,
    maxParkings: 5,
    maxSpots: 300,
    bookingCommissionRate: 0.04,
    features: ["5 tagacha parking, jami 300 tagacha o'rin", 'Komissiya 4%', 'Kengaytirilgan hisobotlar', 'Sensor monitoringi'],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Savdo markazlari va tarmoqlar uchun',
    priceMonthly: 799_000,
    maxParkings: null,
    maxSpots: null,
    bookingCommissionRate: 0.03,
    features: ["Cheksiz parking va o'rinlar", 'Komissiya 3%', 'Excel eksport', 'Sensor monitoringi + API'],
  },
];

export const getPlan = (id: PlanId): Plan => PLANS.find((p) => p.id === id) ?? PLANS[0];

/** Sensor to'plami narxi (1 ta parking o'rni uchun, bir martalik). Namunaviy. */
export const SENSOR_KIT_PRICE = 150_000;

export const limitText = (n: number | null) => (n === null ? 'cheksiz' : String(n));
