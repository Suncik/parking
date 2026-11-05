import { Plan, PlanId, getPlan } from '../data/plans';

export interface SubscriptionRecord {
  id: string;
  login: string; // parking egasi
  planId: PlanId;
  price: number;
  startedAt: number;
  expiresAt: number;
}

const KEY = 'smart-parking-subscriptions';
const EVENT = 'smart-parking-subscriptions-changed';
const DAY = 24 * 60 * 60 * 1000;

export function getSubscriptions(): SubscriptionRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SubscriptionRecord[]) : [];
  } catch {
    return [];
  }
}

/** Egasining faol tarifi (muddati tugamagan). */
export function getActiveSubscription(login: string): SubscriptionRecord | null {
  const now = Date.now();
  return getSubscriptions().find((s) => s.login === login && s.expiresAt > now) ?? null;
}

export function getOwnerPlan(login: string): Plan | null {
  const sub = getActiveSubscription(login);
  return sub ? getPlan(sub.planId) : null;
}

/** Tarifni ulash (demo: to'lov simulyatsiya). Real tizimda server to'lovni tasdiqlaydi. */
export function buyPlan(login: string, planId: PlanId): SubscriptionRecord {
  const plan = getPlan(planId);
  const now = Date.now();
  const rec: SubscriptionRecord = {
    id: `sub-${now}-${Math.random().toString(36).slice(2, 6)}`,
    login,
    planId,
    price: plan.priceMonthly,
    startedAt: now,
    expiresAt: now + 30 * DAY,
  };
  // Eski faol obuna yangisi bilan almashadi
  const others = getSubscriptions().filter((s) => !(s.login === login && s.expiresAt > now));
  try {
    localStorage.setItem(KEY, JSON.stringify([rec, ...others]));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
  return rec;
}

export function clearSubscriptions() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function subscribeSubscriptions(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}
