import React from 'react';
import { ActiveSession } from '../../types';
import { UzbekPlate } from './UzbekPlate';
import { X, CheckCircle, Download, Printer, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  session: ActiveSession;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ session, onClose }) => {
  const checkDate = new Date(session.startTime).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const paymentLabels: Record<string, string> = {
    payme: 'Payme orqali to\'lov',
    click: 'Click Up orqali to\'lov',
    uzum: 'Uzum Bank orqali to\'lov',
    humo_uzcard: 'Humo / Uzcard karta',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Elektron Kvitansiya
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4 bg-white">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#16A34A] mb-2">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              To'lov Muvaffaqiyatli Amalga Oshirildi
            </h3>
            <p className="text-xs text-slate-500">
              Toshkent Shahar Aqlli Avtoturargoh Tizimi
            </p>
          </div>

          {/* Amount Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-xs text-slate-500 font-medium block">
              Jami to'langan summa:
            </span>
            <span className="text-2xl font-bold font-mono text-[#2563EB] tabular-nums">
              {session.totalPaid.toLocaleString('uz-UZ')} so'm
            </span>
          </div>

          {/* Key Details Table */}
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Fiskal chek raqami:</span>
              <span className="font-mono font-semibold text-slate-800">
                #UZ-{session.id.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Sana va vaqt:</span>
              <span className="font-mono text-slate-800">{checkDate}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Avtoturargoh:</span>
              <span className="font-semibold text-slate-900 text-right">
                {session.zoneName}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Joy kodi:</span>
              <span className="font-mono font-bold text-slate-900">
                {session.spotCode}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Avtomobil raqami:</span>
              <UzbekPlate plate={session.vehiclePlate} size="sm" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">To'xtash muddati:</span>
              <span className="font-semibold text-slate-800">
                {session.durationMinutes} daqiqa
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">To'lov tizimi:</span>
              <span className="font-semibold text-slate-800">
                {paymentLabels[session.paymentMethod]}
              </span>
            </div>
          </div>

          {/* QR Code Simulation */}
          <div className="pt-2 flex flex-col items-center justify-center gap-1.5 border-t border-slate-100">
            <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-2">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                <rect x="10" y="10" width="30" height="30" fill="currentColor" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="currentColor" />
                <rect x="60" y="10" width="30" height="30" fill="currentColor" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="currentColor" />
                <rect x="10" y="60" width="30" height="30" fill="currentColor" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="currentColor" />
                <rect x="50" y="50" width="15" height="15" fill="currentColor" />
                <rect x="70" y="60" width="10" height="20" fill="currentColor" />
                <rect x="55" y="75" width="20" height="10" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              soliq.uz elektron fiskal kvitansiya
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              window.print?.();
            }}
            className="py-2 px-3 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Chop etish</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center gap-1.5"
          >
            <span>Yopish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
