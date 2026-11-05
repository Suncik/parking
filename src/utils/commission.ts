/** Platforma komissiyasi: har bir rezervatsiya to'lovidan 5%. */
export const COMMISSION_RATE = 0.05;
export const COMMISSION_PERCENT = COMMISSION_RATE * 100; // 5

export interface PaymentSplit {
  total: number; // haydovchi to'lagan summa (narx o'zgarmaydi)
  commission: number; // platforma ulushi (5%)
  ownerPayout: number; // parking egasiga o'tadigan summa
}

/** Haydovchi to'lovini platforma komissiyasi va parking egasi ulushiga ajratadi. */
export function splitPayment(total: number, rate: number = COMMISSION_RATE): PaymentSplit {
  const commission = Math.round(total * rate);
  return { total, commission, ownerPayout: total - commission };
}

export const formatSom = (n: number) => `${n.toLocaleString('uz-UZ')} so'm`;
