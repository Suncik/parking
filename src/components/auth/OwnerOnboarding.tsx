import React, { useState } from 'react';
import { Building2, MapPin, Package, CheckCircle2, ArrowLeft, ArrowRight, X, AlertCircle } from 'lucide-react';
import { LocationPicker } from './LocationPicker';
import { PLANS, PlanId, SENSOR_KIT_PRICE, getPlan, limitText } from '../../data/plans';
import { TASHKENT_DISTRICTS } from '../../data/places';
import { checkPlanLimits, createApplication } from '../../utils/applicationsStore';
import { formatSom } from '../../utils/commission';

interface OwnerOnboardingProps {
  ownerLogin: string;
  ownerName: string;
  onDone: () => void;
  onCancel?: () => void;
}

const STEPS = ['Tashkilot', 'Parking', 'Tarif', 'Sensor'];

const inputCls =
  'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 bg-white';

export const OwnerOnboarding: React.FC<OwnerOnboardingProps> = ({ ownerLogin, ownerName, onDone, onCancel }) => {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [company, setCompany] = useState('');
  const [inn, setInn] = useState('');

  const [parkingName, setParkingName] = useState('');
  const [districtId, setDistrictId] = useState(TASHKENT_DISTRICTS[0].id);
  const district = TASHKENT_DISTRICTS.find((d) => d.id === districtId) ?? TASHKENT_DISTRICTS[0];
  const [address, setAddress] = useState('');
  const [pos, setPos] = useState({ lat: district.lat, lng: district.lng });
  const [spots, setSpots] = useState('50');
  const [rate, setRate] = useState('5000');
  const [hours, setHours] = useState('24/7 uzluksiz');

  const [planId, setPlanId] = useState<PlanId>('basic');
  const [accepted, setAccepted] = useState(false);

  const spotsNum = parseInt(spots, 10) || 0;
  const rateNum = parseInt(rate, 10) || 0;
  const plan = getPlan(planId);
  const sensorTotal = spotsNum * SENSOR_KIT_PRICE;

  const onDistrictChange = (id: string) => {
    setDistrictId(id);
    const d = TASHKENT_DISTRICTS.find((x) => x.id === id);
    if (d) setPos({ lat: d.lat, lng: d.lng });
  };

  const validate = (s: number): string | null => {
    if (s === 0) {
      if (company.trim().length < 2) return 'Tashkilot nomini kiriting';
      if (!/^\d{9}$/.test(inn.trim())) return "STIR (INN) 9 ta raqamdan iborat bo'lishi kerak";
    }
    if (s === 1) {
      if (parkingName.trim().length < 2) return 'Parking nomini kiriting';
      if (address.trim().length < 3) return 'Manzilni kiriting';
      if (spotsNum < 1 || spotsNum > 5000) return "O'rinlar soni 1 dan 5000 gacha bo'lishi kerak";
      if (rateNum < 500) return "Soatlik narx kamida 500 so'm bo'lishi kerak";
    }
    if (s === 2) {
      const limitErr = checkPlanLimits(ownerLogin, plan, spotsNum);
      if (limitErr) return `${limitErr}. Yuqoriroq tarifni tanlang`;
    }
    if (s === 3 && !accepted) return "Sensor buyurtmasi va shartlarga rozilik bering";
    return null;
  };

  const next = () => {
    const err = validate(step);
    if (err) return setError(err);
    setError(null);
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    createApplication({
      ownerLogin,
      ownerName,
      company: company.trim(),
      inn: inn.trim(),
      parkingName: parkingName.trim(),
      district: district.name,
      address: address.trim(),
      lat: pos.lat,
      lng: pos.lng,
      spots: spotsNum,
      hourlyRate: rateNum,
      hours: hours.trim() || '24/7 uzluksiz',
      planId,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">Ariza yuborildi</h3>
        <p className="text-sm text-slate-600">
          Jamoamiz arizani ko'rib chiqadi, so'ng <b>{spotsNum} ta sensor</b> o'rnatiladi. Sensorlar ishlagach parkingingiz
          haydovchilarga ko'rinadi va {plan.name} tarifi ({formatSom(plan.priceMonthly)}/oy) ulanadi.
        </p>
        <button
          onClick={onDone}
          className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold"
        >
          Davom etish
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900">Parking egasi arizasi</h3>
        {onCancel && (
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Yopish">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Qadamlar */}
      <div className="flex items-center gap-1.5">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? 'bg-[#2563EB]' : 'bg-slate-200'}`} />
            <span className={`text-[10px] font-semibold block mt-1 ${i === step ? 'text-[#2563EB]' : 'text-slate-400'}`}>
              {i + 1}. {label}
            </span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Building2 className="w-4 h-4" /> Tashkilot ma'lumotlari
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-600">Tashkilot nomi</span>
            <input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Masalan: Oybek Biznes Markazi" />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-600">STIR (INN)</span>
            <input
              className={inputCls}
              value={inn}
              inputMode="numeric"
              maxLength={9}
              onChange={(e) => setInn(e.target.value.replace(/\D/g, ''))}
              placeholder="9 ta raqam"
            />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-4 h-4" /> Parking ma'lumotlari
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-600">Parking nomi</span>
            <input className={inputCls} value={parkingName} onChange={(e) => setParkingName(e.target.value)} placeholder="Masalan: Markaziy parking" />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600">Tuman</span>
              <select className={inputCls} value={districtId} onChange={(e) => onDistrictChange(e.target.value)}>
                {TASHKENT_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600">Manzil</span>
              <input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ko'cha, uy" />
            </label>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-600">Xaritada joyni belgilang (bosing yoki sudrang)</span>
            <LocationPicker lat={pos.lat} lng={pos.lng} onChange={(lat, lng) => setPos({ lat, lng })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600">Parking o'rinlari soni</span>
              <input className={inputCls} value={spots} inputMode="numeric" onChange={(e) => setSpots(e.target.value.replace(/\D/g, ''))} />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600">Narx (so'm / soat)</span>
              <input className={inputCls} value={rate} inputMode="numeric" onChange={(e) => setRate(e.target.value.replace(/\D/g, ''))} />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-600">Ish vaqti</span>
            <input className={inputCls} value={hours} onChange={(e) => setHours(e.target.value)} />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Sizning parkingingiz: <b>{spotsNum} ta o'rin</b>. Tarif limitlariga mos keladiganini tanlang.
          </p>
          {PLANS.map((p) => {
            const selected = p.id === planId;
            return (
              <button
                key={p.id}
                onClick={() => setPlanId(p.id)}
                className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                  selected ? 'border-[#2563EB] bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-sm font-extrabold text-slate-900">{p.name}</span>
                    <span className="block text-[11px] text-slate-500">{p.tagline}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold font-mono text-slate-900">{formatSom(p.priceMonthly)}</span>
                    <span className="block text-[10px] text-slate-400">oyiga</span>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                  <div>Parkinglar: {limitText(p.maxParkings)} · O'rinlar: {limitText(p.maxSpots)}</div>
                  <div>Komissiya: {p.bookingCommissionRate * 100}%</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Package className="w-4 h-4" /> Sensor to'plami (majburiy)
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Parking:</span>
              <span className="font-semibold text-slate-900 text-right">{parkingName} ({district.name})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sensor to'plami ({spotsNum} ta × {formatSom(SENSOR_KIT_PRICE)}):</span>
              <span className="font-mono font-bold text-slate-900">{formatSom(sensorTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tarif ({plan.name}), faollashgach oyiga:</span>
              <span className="font-mono font-bold text-slate-900">{formatSom(plan.priceMonthly)}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Parking tizimda avtomatik "bo'sh/band" holatini ko'rsatishi uchun har bir o'ringa ESP32 + ultratovush sensori
            o'rnatiladi. Sensorlar ishga tushgandan keyin parking haydovchilarga ko'rinadi.
          </p>
          <label className="flex items-start gap-2 text-xs text-slate-700">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5" />
            <span>Sensor to'plamini buyurtma qilaman va shartlarga roziman</span>
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {step > 0 && (
          <button
            onClick={() => {
              setError(null);
              setStep(step - 1);
            }}
            className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Orqaga
          </button>
        )}
        <button
          onClick={next}
          className="flex-1 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold flex items-center justify-center gap-1.5"
        >
          {step < 3 ? (
            <>
              Keyingisi <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            'Ariza yuborish'
          )}
        </button>
      </div>
    </div>
  );
};
