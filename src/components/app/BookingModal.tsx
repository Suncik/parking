import { addBooking } from '../../utils/bookingsStore';
import { COMMISSION_PERCENT, splitPayment, formatSom } from '../../utils/commission';
import React, { useState } from 'react';
import { ParkingZone, ParkingSpot, ActiveSession } from '../../types';
import { UzbekPlate } from './UzbekPlate';
import { StatusBadge } from './StatusBadge';
import { X, Clock, CreditCard, ShieldCheck, Check, Sparkles, MapPin } from 'lucide-react';

interface BookingModalProps {
  zone: ParkingZone;
  spot: ParkingSpot | null;
  onClose: () => void;
  onSuccess: (session: ActiveSession) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  zone,
  spot,
  onClose,
  onSuccess,
}) => {
  const [vehiclePlate, setVehiclePlate] = useState('01 A 777 AA');
  const [durationMinutes, setDurationMinutes] = useState(60); // default 1 hour
  const [paymentMethod, setPaymentMethod] = useState<'payme' | 'click' | 'uzum' | 'humo_uzcard'>('payme');
  const [isProcessing, setIsProcessing] = useState(false);

  const durationOptions = [
    { label: '30 daqiqa', minutes: 30, multiplier: 0.5 },
    { label: '1 soat', minutes: 60, multiplier: 1 },
    { label: '2 soat', minutes: 120, multiplier: 2 },
    { label: '3 soat', minutes: 180, multiplier: 3 },
    { label: '4 soat', minutes: 240, multiplier: 4 },
    { label: 'Kunlik (8 soat)', minutes: 480, multiplier: 7 }, // discount
  ];

  const currentOption = durationOptions.find(o => o.minutes === durationMinutes) || durationOptions[1];
  const totalPrice = Math.round(zone.hourlyRate * currentOption.multiplier);

  const quickPlates = [
    '01 A 777 AA',
    '01 010 RAA',
    '01 700 VAA',
    '10 B 123 CD',
  ];

  const handlePayAndStart = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newSession: ActiveSession = {
        id: `sess-${Date.now()}`,
        zoneId: zone.id,
        zoneName: zone.name,
        spotCode: spot ? spot.code : 'A-01',
        vehiclePlate: vehiclePlate.trim().toUpperCase(),
        startTime: Date.now(),
        durationMinutes,
        hourlyRate: zone.hourlyRate,
        paymentMethod,
        totalPaid: totalPrice,
        status: 'active',
      };
      addBooking(zone.name, totalPrice);
      setIsProcessing(false);
      onSuccess(newSession);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                Joy band qilish
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {zone.district}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{zone.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tarif: {zone.hourlyRate.toLocaleString('uz-UZ')} so'm / soat
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Selected Spot Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Avtoturargoh joyi:</span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {spot ? spot.code : 'Avtomatik eng yaqin joy'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Qavat:</span>
              <span className="text-sm font-semibold text-slate-700">
                {spot ? spot.floor : '1-qavat'}
              </span>
            </div>
          </div>

          {/* Vehicle Plate Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Avtomobil davlat raqami:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                placeholder="01 A 777 AA"
                className="w-full px-3.5 py-2.5 text-sm font-mono font-bold tracking-wider rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />
              <div className="shrink-0">
                <UzbekPlate plate={vehiclePlate || '01 A 777 AA'} size="md" />
              </div>
            </div>

            {/* Quick Plate Presets */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400">Tezkor tanlash:</span>
              {quickPlates.map((plate) => (
                <button
                  key={plate}
                  type="button"
                  onClick={() => setVehiclePlate(plate)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-colors ${
                    vehiclePlate === plate
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {plate}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              To'xtash muddati:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {durationOptions.map((opt) => (
                <button
                  key={opt.minutes}
                  type="button"
                  onClick={() => setDurationMinutes(opt.minutes)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                    durationMinutes === opt.minutes
                      ? 'bg-[#2563EB] text-white border-[#2563EB] font-semibold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              To'lov usulini tanlang:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'payme', name: 'Payme', color: '#00CCCC' },
                { id: 'click', name: 'Click Up', color: '#0085FF' },
                { id: 'uzum', name: 'Uzum Bank', color: '#7000FF' },
                { id: 'humo_uzcard', name: 'Humo / Uzcard', color: '#16A34A' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === pm.id
                      ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: pm.color }}
                    />
                    <span className="text-xs font-semibold text-slate-900">
                      {pm.name}
                    </span>
                  </div>
                  {paymentMethod === pm.id && (
                    <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Tarif ({currentOption.label}):</span>
              <span className="font-mono tabular-nums">
                {zone.hourlyRate.toLocaleString('uz-UZ')} so'm × {currentOption.multiplier}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Shahar ekologik xizmat to'lovi:</span>
              <span className="font-mono text-[#16A34A] font-medium">0 so'm (Bepul)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Shundan platforma komissiyasi ({COMMISSION_PERCENT}%):</span>
              <span className="font-mono tabular-nums">{formatSom(splitPayment(totalPrice).commission)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Jami to'lov:</span>
              <span className="text-base font-bold text-[#2563EB] font-mono tabular-nums">
                {totalPrice.toLocaleString('uz-UZ')} so'm
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Bekor qilish
          </button>
          
          <button
            onClick={handlePayAndStart}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            {isProcessing ? (
              <span>To'lov amalga oshirilmoqda...</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>To'lash va sessiyani boshlash</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
