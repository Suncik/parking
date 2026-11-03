import React from 'react';
import { ActiveSession } from '../../types';
import { UzbekPlate } from '../app/UzbekPlate';
import { Clock, CheckCircle2, FileText, Calendar, ArrowRight } from 'lucide-react';

interface MobileHistoryTabProps {
  activeSession: ActiveSession | null;
  onViewReceipt: (session: ActiveSession) => void;
  onGoToMap: () => void;
}

export const MobileHistoryTab: React.FC<MobileHistoryTabProps> = ({
  activeSession,
  onViewReceipt,
  onGoToMap,
}) => {
  const pastSessions: ActiveSession[] = [
    {
      id: 'sess-past-1',
      zoneId: 'parking-3',
      zoneName: 'Parking #3 (Toshkent City Mall)',
      spotCode: 'B-12',
      vehiclePlate: '01 A 777 AA',
      startTime: Date.now() - 28 * 60 * 60 * 1000,
      durationMinutes: 120,
      hourlyRate: 8000,
      paymentMethod: 'payme',
      totalPaid: 16000,
      status: 'completed',
    },
    {
      id: 'sess-past-2',
      zoneId: 'parking-2',
      zoneName: 'Parking #2 (TsUM va Navoiy teatri)',
      spotCode: 'A-05',
      vehiclePlate: '01 A 777 AA',
      startTime: Date.now() - 74 * 60 * 60 * 1000,
      durationMinutes: 60,
      hourlyRate: 6000,
      paymentMethod: 'click',
      totalPaid: 6000,
      status: 'completed',
    },
    {
      id: 'sess-past-3',
      zoneId: 'parking-1',
      zoneName: 'Parking #1 (Amir Temur)',
      spotCode: 'A-14',
      vehiclePlate: '01 A 777 AA',
      startTime: Date.now() - 120 * 60 * 60 * 1000,
      durationMinutes: 180,
      hourlyRate: 5000,
      paymentMethod: 'uzum',
      totalPaid: 15000,
      status: 'completed',
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-24 max-w-md mx-auto">
      {/* Title */}
      <div className="pt-2">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          To'xtash Tarixi
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Faol va yakunlangan avtoturargoh to'lovlari kvitansiyalari
        </p>
      </div>

      {/* Active Session Card if any */}
      {activeSession && (
        <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#16A34A] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Ayni paytda faol</span>
            </span>
            <button
              onClick={() => onViewReceipt(activeSession)}
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Chekni ko'rish</span>
            </button>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              {activeSession.zoneName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <UzbekPlate plate={activeSession.vehiclePlate} size="sm" />
              <span className="text-xs font-mono font-bold text-slate-700">
                Joy: {activeSession.spotCode}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs">
            <span className="text-slate-500">To'langan:</span>
            <span className="font-bold font-mono text-[#2563EB]">
              {activeSession.totalPaid.toLocaleString('uz-UZ')} so'm
            </span>
          </div>
        </div>
      )}

      {/* Past Sessions List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          O'tgan sessiyalar
        </h3>

        {pastSessions.map((sess) => {
          const dateStr = new Date(sess.startTime).toLocaleDateString('uz-UZ', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={sess.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {sess.zoneName}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    {dateStr} · {sess.durationMinutes} daqiqa
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                  {sess.totalPaid.toLocaleString('uz-UZ')} so'm
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <UzbekPlate plate={sess.vehiclePlate} size="sm" />
                <button
                  onClick={() => onViewReceipt(sess)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-50"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kvitansiya</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
