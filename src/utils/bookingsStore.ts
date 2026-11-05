import { splitPayment } from './commission';

export interface BookingRecord {
  id: string;
  createdAt: number;
  parkingName: string;
  amount: number; // haydovchi to'lagan summa
  commission: number; // platforma komissiyasi
  ownerPayout: number; // parking egasiga
}

const KEY = 'smart-parking-bookings';
const EVENT = 'smart-parking-bookings-changed';

export function getBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
  } catch {
    return [];
  }
}

/** Yangi rezervatsiyani saqlaydi. (Demo: brauzer xotirasi. Real tizimda server bazasi.) */
export function addBooking(
  parkingName: string,
  amount: number,
  opts: { login?: string; commissionRate?: number } = {}
): BookingRecord {
  const split = splitPayment(amount, opts.commissionRate);
  const rec: BookingRecord = {
    id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
    parkingName,
    amount,
    commission: split.commission,
    ownerPayout: split.ownerPayout,
    login: opts.login,
    commissionRate: opts.commissionRate,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([rec, ...getBookings()].slice(0, 500)));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* saqlash imkoni yo'q */
  }
  return rec;
}

export function clearBookings() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

/** Ro'yxat o'zgarganda chaqiriladi; obunani bekor qilish funksiyasini qaytaradi. */
export function subscribeBookings(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

/** Haydovchining shu oydagi rezervatsiyalari soni (tarif limiti uchun). */
export function countBookingsThisMonth(login: string): number {
  const d = new Date();
  const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  return getBookings().filter((b) => b.login === login && b.createdAt >= start).length;
}
