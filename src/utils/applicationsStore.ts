import { useEffect, useState } from 'react';
import { Plan, PlanId, SENSOR_KIT_PRICE, getPlan } from '../data/plans';
import { buyPlan, getActiveSubscription } from './subscriptionStore';

export type ApplicationStatus = 'pending' | 'installing' | 'active' | 'rejected';

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: "Ariza ko'rib chiqilmoqda",
  installing: "Sensorlar o'rnatilmoqda",
  active: 'Faol (haydovchilarga ko\'rinadi)',
  rejected: 'Rad etildi',
};

export interface ParkingApplication {
  id: string;
  ownerLogin: string;
  ownerName: string;
  company: string;
  inn: string;
  parkingName: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  spots: number;
  hourlyRate: number;
  hours: string;
  planId: PlanId;
  sensorKits: number; // majburiy: har bir o'rin uchun 1 ta
  sensorTotal: number; // bir martalik jihoz narxi
  status: ApplicationStatus;
  createdAt: number;
  updatedAt: number;
}

const KEY = 'smart-parking-applications';
const EVENT = 'smart-parking-applications-changed';

export function getApplications(): ParkingApplication[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ParkingApplication[]) : [];
  } catch {
    return [];
  }
}

function save(list: ParkingApplication[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export type NewApplication = Omit<
  ParkingApplication,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'sensorKits' | 'sensorTotal'
>;

/** Yangi ariza. Sensor majburiy: har bir parking o'rni uchun 1 tadan to'plam buyurtma qilinadi. */
export function createApplication(data: NewApplication): ParkingApplication {
  const now = Date.now();
  const app: ParkingApplication = {
    ...data,
    id: `app-${now}-${Math.random().toString(36).slice(2, 6)}`,
    sensorKits: data.spots,
    sensorTotal: data.spots * SENSOR_KIT_PRICE,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  save([app, ...getApplications()]);
  return app;
}

/** Admin holatni o'zgartiradi. Faollashtirilganda egasiga tanlangan tarif ulanadi (obuna hisoblanadi). */
export function setApplicationStatus(id: string, status: ApplicationStatus) {
  const list = getApplications();
  const app = list.find((a) => a.id === id);
  if (!app) return;
  app.status = status;
  app.updatedAt = Date.now();
  save(list);
  if (status === 'active') {
    const sub = getActiveSubscription(app.ownerLogin);
    if (!sub || sub.planId !== app.planId) buyPlan(app.ownerLogin, app.planId);
  }
}

export function clearApplications() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function subscribeApplications(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

/** Barcha arizalar (o'zgarganda yangilanadi). */
export function useApplications(): ParkingApplication[] {
  const [list, setList] = useState<ParkingApplication[]>(() => getApplications());
  useEffect(() => subscribeApplications(() => setList(getApplications())), []);
  return list;
}

/** Egasining tarif limitlarini tekshiradi. Xato matni yoki null (hammasi joyida). */
export function checkPlanLimits(ownerLogin: string, plan: Plan, newSpots: number): string | null {
  const mine = getApplications().filter((a) => a.ownerLogin === ownerLogin && a.status !== 'rejected');
  const parkings = mine.length + 1;
  const spots = mine.reduce((s, a) => s + a.spots, 0) + newSpots;
  if (plan.maxParkings !== null && parkings > plan.maxParkings) {
    return `${plan.name} tarifida ${plan.maxParkings} tagacha parking bo'lishi mumkin`;
  }
  if (plan.maxSpots !== null && spots > plan.maxSpots) {
    return `${plan.name} tarifida jami ${plan.maxSpots} tagacha o'rin bo'lishi mumkin (sizda ${spots} ta bo'ladi)`;
  }
  return null;
}

export { getPlan };
