import React, { useState, useEffect } from 'react';
import { ActiveSession } from '../../types';
import { UzbekPlate } from './UzbekPlate';
import { Clock, Plus, Square, FileText, CheckCircle2 } from 'lucide-react';

interface ActiveSessionWidgetProps {
  session: ActiveSession;
  onExtend: (minutes: number) => void;
  onEndSession: () => void;
  onViewReceipt: () => void;
}

export const ActiveSessionWidget: React.FC<ActiveSessionWidgetProps> = ({
  session,
  onExtend,
  onEndSession,
  onViewReceipt,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - session.startTime) / 1000);
      setElapsedSeconds(Math.max(0, elapsed));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [session.startTime]);

  const totalPrepaidSeconds = session.durationMinutes * 60;
  const remainingSeconds = Math.max(0, totalPrepaidSeconds - elapsedSeconds);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const percentUsed = Math.min(100, Math.round((elapsedSeconds / totalPrepaidSeconds) * 100));

  return (
    <div className="sp-card border-2 border-blue-200 bg-white p-4 sm:p-5 shadow-lg relative overflow-hidden">
      {/* Subtle indicator bar on top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
        <div
          className="h-full bg-[#2563EB] transition-all duration-1000"
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#16A34A] border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Faol To'xtash Sessiyasi</span>
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono font-bold text-slate-700">
              Joy: {session.spotCode}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {session.zoneName}
          </h3>

          <div className="flex items-center gap-2 pt-0.5">
            <UzbekPlate plate={session.vehiclePlate} size="sm" />
            <span className="text-xs text-slate-500">
              Tarif: {session.hourlyRate.toLocaleString('uz-UZ')} so'm/soat
            </span>
          </div>
        </div>

        {/* Center Timer */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Qolgan vaqt:</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                {formatTime(remainingSeconds)}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">To'langan summa:</span>
            <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
              {session.totalPaid.toLocaleString('uz-UZ')} so'm
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onExtend(30)}
            className="py-2 px-3 text-xs font-semibold rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+30 daq</span>
          </button>

          <button
            onClick={onViewReceipt}
            className="py-2 px-3 text-xs font-semibold rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Elektron chek</span>
          </button>

          <button
            onClick={onEndSession}
            className="py-2 px-3 text-xs font-semibold rounded-xl bg-[#DC2626] text-white hover:bg-red-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Yakunlash</span>
          </button>
        </div>
      </div>
    </div>
  );
};
