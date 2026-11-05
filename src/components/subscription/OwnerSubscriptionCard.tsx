import React, { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { PlansPicker } from './PlansPicker';
import { PLANS, getPlan } from '../../data/plans';
import { buyPlan, getActiveSubscription, subscribeSubscriptions } from '../../utils/subscriptionStore';
import { useApplications } from '../../utils/applicationsStore';
import { loadSession } from '../../data/auth';

/** Parking egasining joriy tarifi. Tarif parking faollashganda ulanadi; keyin o'zgartirish mumkin. */
export const OwnerSubscriptionCard: React.FC = () => {
  const login = loadSession()?.login ?? 'guest';
  const [sub, setSub] = useState(() => getActiveSubscription(login));
  const [open, setOpen] = useState(false);
  const mine = useApplications().filter((a) => a.ownerLogin === login && a.status !== 'rejected');

  useEffect(() => subscribeSubscriptions(() => setSub(getActiveSubscription(login))), [login]);

  const totalSpots = mine.reduce((s, a) => s + a.spots, 0);
  // Faqat mavjud parkinglar limitiga sig'adigan tariflar taklif qilinadi
  const fitting = PLANS.filter(
    (p) => (p.maxParkings === null || mine.length <= p.maxParkings) && (p.maxSpots === null || totalSpots <= p.maxSpots)
  );

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Tarif: {sub ? `${getPlan(sub.planId).name} (faol)` : 'hali ulanmagan'}
          </h3>
          <p className="text-xs text-slate-500">
            {sub
              ? `${new Date(sub.expiresAt).toLocaleDateString('uz-UZ')} gacha · komissiya ${getPlan(sub.planId).bookingCommissionRate * 100}%`
              : "Tarif birinchi parkingingiz faollashganda ulanadi"}
          </p>
        </div>
      </div>
      {sub && (
        <button
          onClick={() => setOpen(true)}
          className="px-4 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          Tarifni o'zgartirish
        </button>
      )}

      {open && (
        <PlansPicker
          title="Tarifni tanlang"
          plans={fitting}
          currentPlanId={sub ? sub.planId : null}
          expiresAt={sub?.expiresAt ?? null}
          onBuy={(id) => buyPlan(login, id)}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
};
