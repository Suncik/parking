import React, { useEffect, useState } from 'react';
import { Wallet, Receipt, Trash2 } from 'lucide-react';
import { COMMISSION_PERCENT, splitPayment, formatSom } from '../../utils/commission';
import { BookingRecord, clearBookings, getBookings, subscribeBookings } from '../../utils/bookingsStore';
import { SubscriptionRecord, clearSubscriptions, getSubscriptions, subscribeSubscriptions } from '../../utils/subscriptionStore';
import { getPlan } from '../../data/plans';

// Namunaviy (demo) oylik tushum: admin paneldagi "Oylik daromad" kartasi bilan bir xil
const DEMO_MONTHLY_REVENUE = 248_500_000;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const PlatformRevenuePanel: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>(() => getBookings());

  const [subs, setSubs] = useState<SubscriptionRecord[]>(() => getSubscriptions());

  useEffect(() => subscribeBookings(() => setBookings(getBookings())), []);
  useEffect(() => subscribeSubscriptions(() => setSubs(getSubscriptions())), []);

  const subsRevenue = subs.reduce((a, s) => a + s.price, 0);
  const commissionTotal = bookings.reduce((a, b) => a + b.commission, 0);

  const today = bookings.filter((b) => b.createdAt >= startOfToday());
  const sum = (list: BookingRecord[], k: 'amount' | 'commission') => list.reduce((a, b) => a + b[k], 0);

  const demoMonthlyCommission = splitPayment(DEMO_MONTHLY_REVENUE).commission;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Platforma foydasi</h3>
            <p className="text-xs text-slate-500">Har bir rezervatsiyadan {COMMISSION_PERCENT}% komissiya</p>
          </div>
        </div>
        {(bookings.length > 0 || subs.length > 0) && (
          <button
            onClick={() => {
              clearBookings();
              clearSubscriptions();
            }}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors"
            title="Ilova orqali qilingan sinov rezervatsiyalarini tozalash"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Tozalash
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Bugungi foyda
          </span>
          <span className="text-xl font-extrabold font-mono text-emerald-700 tabular-nums block mt-1">
            {formatSom(sum(today, 'commission'))}
          </span>
          <span className="text-[11px] text-emerald-700/70 block mt-1">{today.length} ta rezervatsiyadan</span>
        </div>

        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            Komissiyadan jami (ilova)
          </span>
          <span className="text-xl font-extrabold font-mono text-[#2563EB] tabular-nums block mt-1">
            {formatSom(commissionTotal)}
          </span>
          <span className="text-[11px] text-blue-700/70 block mt-1">
            {bookings.length} ta rezervatsiya · aylanma {formatSom(sum(bookings, 'amount'))}
          </span>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Obunalardan daromad
          </span>
          <span className="text-xl font-extrabold font-mono text-amber-700 tabular-nums block mt-1">
            {formatSom(subsRevenue)}
          </span>
          <span className="text-[11px] text-amber-700/70 block mt-1">{subs.filter((s) => s.price > 0).length} ta pullik obuna</span>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Oylik (namunaviy)
          </span>
          <span className="text-xl font-extrabold font-mono text-slate-800 tabular-nums block mt-1">
            {formatSom(demoMonthlyCommission)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {formatSom(DEMO_MONTHLY_REVENUE)} tushumdan
          </span>
        </div>
      </div>

      {subs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
            <Receipt className="w-4 h-4 text-slate-400" />
            So'nggi obunalar
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="text-left font-bold px-3 py-2">Vaqt</th>
                  <th className="text-left font-bold px-3 py-2">Foydalanuvchi</th>
                  <th className="text-left font-bold px-3 py-2">Tarif</th>
                  <th className="text-right font-bold px-3 py-2">To'lov</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subs.slice(0, 6).map((s) => (
                  <tr key={s.id}>
                    <td className="px-3 py-2 font-mono text-slate-500">
                      {new Date(s.startedAt).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-3 py-2 text-slate-800">{s.login}</td>
                    <td className="px-3 py-2 font-semibold text-slate-800">{getPlan(s.planId).name}</td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-amber-600">+{formatSom(s.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
          <Receipt className="w-4 h-4 text-slate-400" />
          So'nggi rezervatsiyalar
        </div>
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
            Hali rezervatsiya yo'q. Mobil ilovada joy band qilsangiz, shu yerda ko'rinadi.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="text-left font-bold px-3 py-2">Vaqt</th>
                  <th className="text-left font-bold px-3 py-2">Avtoturargoh</th>
                  <th className="text-right font-bold px-3 py-2">To'lov</th>
                  <th className="text-right font-bold px-3 py-2">Komissiya ({COMMISSION_PERCENT}%)</th>
                  <th className="text-right font-bold px-3 py-2">Egasiga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 8).map((b) => (
                  <tr key={b.id}>
                    <td className="px-3 py-2 font-mono text-slate-500">
                      {new Date(b.createdAt).toLocaleString('uz-UZ', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2 font-semibold text-slate-800">{b.parkingName}</td>
                    <td className="px-3 py-2 text-right font-mono text-slate-700">{formatSom(b.amount)}</td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-emerald-600">
                      +{formatSom(b.commission)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-slate-500">{formatSom(b.ownerPayout)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
