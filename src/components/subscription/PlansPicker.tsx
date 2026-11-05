import React, { useState } from 'react';
import { Check, Crown, Loader2, X } from 'lucide-react';
import { Plan, PlanId } from '../../data/plans';
import { formatSom } from '../../utils/commission';

interface PlansPickerProps {
  title: string;
  plans: Plan[];
  currentPlanId: PlanId | null;
  expiresAt: number | null;
  onBuy: (planId: PlanId) => void;
  onClose: () => void;
}

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const PlansPicker: React.FC<PlansPickerProps> = ({ title, plans, currentPlanId, expiresAt, onBuy, onClose }) => {
  const [confirmId, setConfirmId] = useState<PlanId | null>(null);
  const [paying, setPaying] = useState(false);

  const confirmPlan = plans.find((p) => p.id === confirmId) || null;

  const pay = () => {
    if (!confirmPlan) return;
    setPaying(true);
    // Demo: to'lov simulyatsiyasi
    setTimeout(() => {
      onBuy(confirmPlan.id);
      setPaying(false);
      setConfirmId(null);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Yopish">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {plans.map((p) => {
            const isCurrent = p.id === currentPlanId;
            const highlight = p.id === 'pro';
            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-4 ${
                  isCurrent ? 'border-[#2563EB] bg-blue-50/50' : highlight ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {highlight && <Crown className="w-4 h-4 text-amber-500" />}
                      <span className="text-sm font-extrabold text-slate-900">{p.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-[#2563EB] bg-blue-100 rounded px-1.5 py-0.5">
                          Faol
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">{p.tagline}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold font-mono text-slate-900 tabular-nums">
                      {p.priceMonthly === 0 ? 'Bepul' : formatSom(p.priceMonthly)}
                    </span>
                    {p.priceMonthly > 0 && <span className="block text-[10px] text-slate-400">oyiga</span>}
                  </div>
                </div>

                <ul className="mt-3 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-[#16A34A] mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="mt-3 text-[11px] text-slate-500">
                    {expiresAt ? `Amal qilish muddati: ${formatDate(expiresAt)}` : 'Standart tarif'}
                  </div>
                ) : p.priceMonthly > 0 ? (
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="mt-3 w-full h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors"
                  >
                    {p.name} ga o'tish
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* To'lovni tasdiqlash */}
        {confirmPlan && (
          <div className="absolute inset-0 bg-white/95 rounded-3xl flex items-center justify-center p-6">
            <div className="w-full space-y-4 text-center">
              <h4 className="text-base font-extrabold text-slate-900">{confirmPlan.name} tarifini tasdiqlang</h4>
              <p className="text-sm text-slate-600">
                Kartangizdan <b className="font-mono">{formatSom(confirmPlan.priceMonthly)}</b> yechiladi. Tarif 30 kun amal qiladi.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmId(null)}
                  disabled={paying}
                  className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={pay}
                  disabled={paying}
                  className="flex-1 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {paying && <Loader2 className="w-4 h-4 animate-spin" />}
                  To'lash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
