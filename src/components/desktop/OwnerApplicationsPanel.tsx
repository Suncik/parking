import React from 'react';
import { ClipboardCheck, Check, Wrench, X } from 'lucide-react';
import { ApplicationStatus, STATUS_LABEL, clearApplications, setApplicationStatus, useApplications } from '../../utils/applicationsStore';
import { getPlan } from '../../data/plans';
import { formatSom } from '../../utils/commission';

const BADGE: Record<ApplicationStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  installing: 'bg-blue-50 text-blue-700 border-blue-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

/** Admin: parking egalarining arizalarini ko'rib chiqish. */
export const OwnerApplicationsPanel: React.FC = () => {
  const apps = useApplications();
  const sensorRevenue = apps
    .filter((a) => a.status === 'installing' || a.status === 'active')
    .reduce((s, a) => s + a.sensorTotal, 0);
  const pendingCount = apps.filter((a) => a.status === 'pending').length;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Parking egalari arizalari</h3>
            <p className="text-xs text-slate-500">
              {pendingCount} ta yangi · jihoz sotuvi: {formatSom(sensorRevenue)}
            </p>
          </div>
        </div>
        {apps.length > 0 && (
          <button
            onClick={() => clearApplications()}
            className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors"
          >
            Tozalash
          </button>
        )}
      </div>

      {apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
          Hali ariza yo'q. Parking egasi sifatida ro'yxatdan o'tganda shu yerda paydo bo'ladi.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
          {apps.map((a) => (
            <div key={a.id} className="p-3 text-xs space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 block">
                    {a.parkingName} <span className="font-normal text-slate-500">· {a.company} (STIR {a.inn})</span>
                  </span>
                  <span className="text-slate-500 block">
                    {a.district} · {a.address} · {a.spots} ta o'rin · {formatSom(a.hourlyRate)}/soat
                  </span>
                  <span className="text-slate-400 block">
                    Tarif: {getPlan(a.planId).name} · Sensor: {a.sensorKits} ta ({formatSom(a.sensorTotal)}) · Egasi: {a.ownerName}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full border font-semibold ${BADGE[a.status]}`}>
                  {STATUS_LABEL[a.status]}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {a.status === 'pending' && (
                  <>
                    <button
                      onClick={() => setApplicationStatus(a.id, 'installing')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold"
                    >
                      <Wrench className="w-3.5 h-3.5" /> Tasdiqlash · sensor o'rnatish
                    </button>
                    <button
                      onClick={() => setApplicationStatus(a.id, 'rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold"
                    >
                      <X className="w-3.5 h-3.5" /> Rad etish
                    </button>
                  </>
                )}
                {a.status === 'installing' && (
                  <button
                    onClick={() => setApplicationStatus(a.id, 'active')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-emerald-700 text-white font-bold"
                  >
                    <Check className="w-3.5 h-3.5" /> Sensorlar ishlayapti · faollashtirish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
