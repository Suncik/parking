import React, { useState } from 'react';
import { Building2, Plus, Clock, CheckCircle2, Wrench, XCircle } from 'lucide-react';
import { OwnerOnboarding } from '../auth/OwnerOnboarding';
import { ApplicationStatus, STATUS_LABEL, useApplications } from '../../utils/applicationsStore';
import { loadSession } from '../../data/auth';
import { formatSom } from '../../utils/commission';

const STATUS_STYLE: Record<ApplicationStatus, { cls: string; Icon: React.ElementType }> = {
  pending: { cls: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Clock },
  installing: { cls: 'bg-blue-50 text-blue-700 border-blue-200', Icon: Wrench },
  active: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  rejected: { cls: 'bg-rose-50 text-rose-700 border-rose-200', Icon: XCircle },
};

/** Parking egasining parkinglari va ariza holatlari. */
export const OwnerParkingsCard: React.FC = () => {
  const session = loadSession();
  const apps = useApplications().filter((a) => a.ownerLogin === session?.login);
  const [open, setOpen] = useState(false);

  if (!session) return null;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Mening parkinglarim</h3>
            <p className="text-xs text-slate-500">Parking faollashishi uchun sensorlar o'rnatilishi shart</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3 h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> Parking qo'shish
        </button>
      </div>

      {apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
          Hali parking qo'shilmagan. "Parking qo'shish" tugmasini bosing.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
          {apps.map((a) => {
            const { cls, Icon } = STATUS_STYLE[a.status];
            return (
              <div key={a.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 block truncate">{a.parkingName}</span>
                  <span className="text-slate-500 block truncate">
                    {a.district} · {a.address} · {a.spots} ta o'rin · {formatSom(a.hourlyRate)}/soat
                  </span>
                  <span className="text-slate-400 block">
                    Sensor to'plami: {a.sensorKits} ta ({formatSom(a.sensorTotal)})
                  </span>
                </div>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-semibold ${cls}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {STATUS_LABEL[a.status]}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <OwnerOnboarding
              ownerLogin={session.login}
              ownerName={session.displayName}
              onDone={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};
