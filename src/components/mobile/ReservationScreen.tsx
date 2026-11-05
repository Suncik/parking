import { COMMISSION_RATE, COMMISSION_PERCENT, splitPayment, formatSom } from '../../utils/commission';
import React, { useState, useEffect, useRef } from 'react';
import { addBooking } from '../../utils/bookingsStore';
import { UzbekPlate } from '../app/UzbekPlate';
import { SavedCard } from '../../types';
import { formatCardNumber, formatExpiry, detectCardType } from '../../data/savedCards';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronDown,
  QrCode,
  ShieldCheck,
  CreditCard,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Navigation,
  Smartphone,
  Lock,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface ReservationScreenProps {
  savedCards: SavedCard[];
  onAddCard: (card: SavedCard) => void;
  onBackToMap?: () => void;
}

export const ReservationScreen: React.FC<ReservationScreenProps> = ({
  savedCards,
  onAddCard,
  onBackToMap,
}) => {
  // Platforma komissiyasi (haydovchi narxi o'zgarmaydi, komissiya narx ichida)
  const commissionRate = COMMISSION_RATE;
  const commissionPercent = COMMISSION_PERCENT;
  // Step in the flow:
  // 1: Slot & Vehicle Selection
  // 2: Payment Method Selection ("To'lov usuli")
  // 3: 6-digit SMS Confirmation Screen
  // 4: Success Card with Large QR Code
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // View mode switcher: 'step' (Interactive wizard), 'both' (Show as two states on one screen)
  const [viewMode, setViewMode] = useState<'step' | 'both'>('step');

  // Step 1: Form selections
  const [selectedParking, setSelectedParking] = useState('Parking A');
  const [selectedSlot, setSelectedSlot] = useState('18:00–19:00'); // Exact prompt
  const [selectedSpotCode, setSelectedSpotCode] = useState('P17'); // Exact prompt
  const [selectedVehicle, setSelectedVehicle] = useState('01 A 777 AA');
  const [durationHours, setDurationHours] = useState(2); // 2 hours -> 10 000 so'm

  // Step 2: Payment options
  // Options: Humo/Uzcard karta, Payme, Click, Uzum Bank
  const [paymentOption, setPaymentOption] = useState<'karta' | 'payme' | 'click' | 'uzum'>('karta');
  
  // For Humo/Uzcard karta: Select saved card OR enter new card
  const [selectedCardId, setSelectedCardId] = useState<string>(
    savedCards.find((c) => c.isPrimary)?.id || savedCards[0]?.id || 'new'
  );
  const [isEnteringNewCard, setIsEnteringNewCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [cardError, setCardError] = useState<string | null>(null);

  // Step 3: SMS confirmation code
  const [smsCode, setSmsCode] = useState(['', '', '', '', '', '']);
  const [smsCountdown, setSmsCountdown] = useState(59);
  const [smsError, setSmsError] = useState<string | null>(null);

  // Countdown timer for SMS
  useEffect(() => {
    let timer: any;
    if (currentStep === 3 && smsCountdown > 0) {
      timer = setInterval(() => setSmsCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, smsCountdown]);

  // Parkings
  const parkings = [
    { id: 'parking-a', name: 'Parking A', address: 'Amir Temur shoh ko\'chasi, 2', rate: 5000, free: 14 },
    { id: 'parking-b', name: 'Parking B', address: 'Botir Zokirov ko\'chasi, 7', rate: 8000, free: 88 },
    { id: 'parking-c', name: 'Parking C', address: 'Zarafshon ko\'chasi, 10', rate: 6000, free: 24 },
  ];

  // Time slots
  const timeSlots = [
    '16:00–17:00',
    '17:00–18:00',
    '18:00–19:00',
    '18:00–20:00',
    '19:00–21:00',
    '20:00–22:00',
  ];

  const currentParkingObj = parkings.find((p) => p.name === selectedParking) || parkings[0];
  const totalPrice = currentParkingObj.rate * durationHours; // e.g. 10 000 so'm
  const priceSummaryText = `Narx: ${totalPrice.toLocaleString('uz-UZ')} so'm (${durationHours} soat)`;

  const selectedCard = savedCards.find((c) => c.id === selectedCardId);

  // To'lov muvaffaqiyatli yakunlanganda rezervatsiyani saqlaymiz (admin paneldagi platforma foydasi uchun)
  const bookingRecordedRef = useRef(false);
  useEffect(() => {
    if (currentStep === 4) {
      if (!bookingRecordedRef.current) {
        bookingRecordedRef.current = true;
        addBooking(selectedParking, totalPrice);
      }
    } else {
      bookingRecordedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Handle proceed to payment step
  const handleProceedToPayment = () => {
    setCurrentStep(2);
  };

  // Handle Pay button click in Step 2
  const handlePayClick = () => {
    if (paymentOption === 'karta') {
      if (isEnteringNewCard) {
        const clean = newCardNumber.replace(/\D/g, '');
        if (clean.length < 16) {
          setCardError('Karta raqami 16 ta raqam bo\'lishi kerak (8600 0000 0000 0000)');
          return;
        }
        if (newCardExpiry.length < 5) {
          setCardError('Amal qilish muddatini MM/YY ko\'rinishida kiriting');
          return;
        }
      }
      // Proceed to 6-digit SMS confirmation code screen
      setCurrentStep(3);
      setSmsCountdown(59);
      setSmsCode(['7', '4', '2', '8', '1', '9']); // prefill demo helper
    } else {
      // Payme, Click, Uzum -> direct demo completion
      setCurrentStep(4);
    }
  };

  // Handle SMS code input
  const handleSmsDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const next = [...smsCode];
    next[index] = val;
    setSmsCode(next);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`sms-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Confirm SMS Code
  const handleConfirmSms = () => {
    const fullCode = smsCode.join('');
    if (fullCode.length < 6) {
      setSmsError('Iltimos, 6 xonali SMS kodni to\'liq kiriting');
      return;
    }
    setSmsError(null);
    setCurrentStep(4);
  };

  /* ========================================================
     Step 1: Selection Form (Parking A, time slot, price)
     ======================================================== */
  const renderSelectionStep = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          1. Joy va vaqtni tanlash
        </span>
        <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full font-mono">
          Bosqich 1 / 3
        </span>
      </div>

      {/* Parking Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Avtoturargoh:
        </label>
        <div className="relative">
          <select
            value={selectedParking}
            onChange={(e) => setSelectedParking(e.target.value)}
            className="w-full h-12 pl-3.5 pr-10 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-1 focus:ring-[#2563EB]/20 transition-all cursor-pointer"
          >
            {parkings.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.address.split(',')[0]} · {p.free} ta bo'sh)
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#2563EB]" />
          <span>{currentParkingObj.address} · 5 000 so'm/soat</span>
        </p>
      </div>

      {/* Vehicle and Spot */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Avtomobil va joy:
        </label>
        <div className="flex items-center gap-2">
          <UzbekPlate plate={selectedVehicle} size="md" />
          <span className="text-xs text-slate-500 font-medium">
            Joy: <strong className="font-mono text-slate-900">{selectedSpotCode}</strong>
          </span>
        </div>
      </div>

      {/* Time Slot Picker */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-700">
            To'xtash vaqti (Time slot):
          </label>
          <span className="text-xs text-[#2563EB] font-mono font-bold">
            {selectedSlot}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`h-11 rounded-xl text-xs font-semibold font-mono border transition-all flex items-center justify-center select-none ${
                  isSelected
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Tarif (5 000 × {durationHours} soat):</span>
          <span className="font-mono text-slate-800">10 000 so'm</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
          <span>Shundan platforma komissiyasi ({commissionPercent}%):</span>
          <span className="font-mono text-slate-800">{formatSom(splitPayment(totalPrice, commissionRate).commission)}</span>
        </div>
        <div className="mt-1 pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Umumiy summa:</span>
          {/* Exact Prompt: "Narx: 10 000 so'm (2 soat)" */}
          <span className="text-base font-extrabold text-[#2563EB] font-mono tabular-nums">
            {priceSummaryText}
          </span>
        </div>
      </div>

      {/* Blue Button "Tasdiqlash" -> Proceeds to Step 2: To'lov usuli */}
      <button
        onClick={handleProceedToPayment}
        className="w-full h-12 rounded-xl text-sm font-bold tracking-wide uppercase text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 select-none"
      >
        <span>To'lovga o'tish</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  /* ========================================================
     Step 2: Payment Step ("To'lov usuli")
     Options: Humo/Uzcard karta, Payme, Click, Uzum Bank
     ======================================================== */
  const renderPaymentStep = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(1)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Orqaga"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            To'lov usuli
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full font-mono">
          Bosqich 2 / 3
        </span>
      </div>

      {/* Summary Recap banner */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[10px] font-sans">Avtoturargoh:</span>
          <span className="font-bold text-slate-900">{selectedParking} ({selectedSpotCode})</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block text-[10px] font-sans">To'lov miqdori:</span>
          <span className="font-bold text-[#2563EB]">{formatSom(totalPrice)}</span>
          <span className="text-slate-400 block text-[10px] font-sans">
            shundan komissiya ({commissionPercent}%): {formatSom(splitPayment(totalPrice, commissionRate).commission)}
          </span>
        </div>
      </div>

      {/* Payment Options Grid: Humo/Uzcard karta, Payme, Click, Uzum Bank */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 mb-1">
          To'lov tizimini tanlang:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {/* Option 1: Humo/Uzcard karta */}
          <button
            type="button"
            onClick={() => {
              setPaymentOption('karta');
              setCardError(null);
            }}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
              paymentOption === 'karta'
                ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <CreditCard className="w-4 h-4 text-[#2563EB]" />
              {paymentOption === 'karta' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
            </div>
            <div className="mt-2">
              <span className="text-xs font-bold text-slate-900 block">
                Humo / Uzcard
              </span>
              <span className="text-[10px] text-slate-500">Bank kartasi</span>
            </div>
          </button>

          {/* Option 2: Payme */}
          <button
            type="button"
            onClick={() => setPaymentOption('payme')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
              paymentOption === 'payme'
                ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="w-3 h-3 rounded-full bg-[#00CCCC]" />
              {paymentOption === 'payme' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
            </div>
            <div className="mt-2">
              <span className="text-xs font-bold text-slate-900 block">Payme</span>
              <span className="text-[10px] text-slate-500">Tezkor to'lov</span>
            </div>
          </button>

          {/* Option 3: Click */}
          <button
            type="button"
            onClick={() => setPaymentOption('click')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
              paymentOption === 'click'
                ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="w-3 h-3 rounded-full bg-[#0085FF]" />
              {paymentOption === 'click' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
            </div>
            <div className="mt-2">
              <span className="text-xs font-bold text-slate-900 block">Click Up</span>
              <span className="text-[10px] text-slate-500">Click pass</span>
            </div>
          </button>

          {/* Option 4: Uzum Bank */}
          <button
            type="button"
            onClick={() => setPaymentOption('uzum')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
              paymentOption === 'uzum'
                ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="w-3 h-3 rounded-full bg-[#7000FF]" />
              {paymentOption === 'uzum' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
            </div>
            <div className="mt-2">
              <span className="text-xs font-bold text-slate-900 block">Uzum Bank</span>
              <span className="text-[10px] text-slate-500">Keshbek 2%</span>
            </div>
          </button>
        </div>
      </div>

      {/* For Humo/Uzcard karta: Saved cards selection + new card form */}
      {paymentOption === 'karta' && (
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Kartani tanlang:
            </label>
            <button
              type="button"
              onClick={() => setIsEnteringNewCard(!isEnteringNewCard)}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              {isEnteringNewCard ? 'Saqlangan kartalardan tanlash' : '+ Yangi karta'}
            </button>
          </div>

          {!isEnteringNewCard ? (
            /* Exact Prompt: Saved cards from profile selectable (e.g. Humo •••• 4421, marked "Asosiy") */
            <div className="space-y-2">
              {savedCards.map((card) => {
                const isSelected = selectedCardId === card.id;
                const isHumo = card.type === 'humo';

                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Badge: Uzcard or Humo */}
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          isHumo
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-[#2563EB] border border-blue-300'
                        }`}
                      >
                        {isHumo ? 'HUMO' : 'UZCARD'}
                      </span>

                      <div>
                        {/* Number & Asosiy badge */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold font-mono text-slate-900">
                            {isHumo ? 'Humo' : 'Uzcard'} •••• {card.last4}
                          </span>
                          {card.isPrimary && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#16A34A] text-white">
                              Asosiy
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {card.bankName} · {card.expiry}
                        </span>
                      </div>
                    </div>

                    <div className="w-5 h-5 rounded-full border flex items-center justify-center">
                      {isSelected && <span className="w-3 h-3 rounded-full bg-[#2563EB]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Exact Prompt: For karta: card number input (8600 0000 0000 0000 format), expiry MM/YY */
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Karta raqami (8600 0000 0000 0000):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newCardNumber}
                    onChange={(e) => {
                      setNewCardNumber(formatCardNumber(e.target.value));
                      setCardError(null);
                    }}
                    placeholder="8600 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-3 py-2 text-xs font-mono font-bold tracking-wider rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#2563EB]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-slate-400">
                    {detectCardType(newCardNumber).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Amal qilish muddati (MM/YY):
                  </label>
                  <input
                    type="text"
                    value={newCardExpiry}
                    onChange={(e) => {
                      setNewCardExpiry(formatExpiry(e.target.value));
                      setCardError(null);
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-center rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <span className="text-[10px] text-slate-400 pb-2">
                    🔒 3D-Secure SMS orqali tasdiqlanadi
                  </span>
                </div>
              </div>

              {cardError && (
                <p className="text-xs text-rose-600 font-semibold">{cardError}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pay CTA Button */}
      <button
        onClick={handlePayClick}
        className="w-full h-12 rounded-xl text-sm font-bold tracking-wide uppercase text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 select-none"
      >
        <span>To'lash (10 000 so'm)</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-[11px] text-slate-400 text-center">
        * Bu demo to'lov tizimi bo'lib, haqiqiy mablag' yechilmaydi.
      </p>
    </div>
  );

  /* ========================================================
     Step 3: 6-Digit SMS Confirmation Code Screen
     Exact Prompt: "then a 6-digit SMS confirmation code screen"
     ======================================================== */
  const renderSmsStep = () => (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <button
          onClick={() => setCurrentStep(2)}
          className="text-xs font-bold text-[#2563EB] flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>To'lovga qaytish</span>
        </button>
        <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full font-mono">
          Bosqich 3 / 3
        </span>
      </div>

      {/* Title & Instructions */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-2">
          <Smartphone className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          SMS Tasdiqlash Kodi
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          To'lovni tasdiqlash uchun <strong>+998 (90) 123-**-67</strong> raqamiga yuborilgan 6 xonali SMS kodni kiriting
        </p>
      </div>

      {/* Demo SMS Simulator Badge */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1.5">
        <span className="text-[11px] font-bold text-amber-900 block">
          📩 Demo SMS keldi: <strong className="font-mono text-sm tracking-wider">742 819</strong>
        </span>
        <button
          type="button"
          onClick={() => setSmsCode(['7', '4', '2', '8', '1', '9'])}
          className="text-[11px] font-semibold text-[#2563EB] hover:underline"
        >
          Kodni avtomatik to'ldirish
        </button>
      </div>

      {/* 6-Digit SMS Input Boxes */}
      <div>
        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          {smsCode.map((digit, index) => (
            <input
              key={index}
              id={`sms-input-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleSmsDigitChange(index, e.target.value)}
              className="w-11 h-13 text-center text-xl font-bold font-mono rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
            />
          ))}
        </div>

        {smsError && (
          <p className="text-xs text-rose-600 font-semibold text-center mt-2">
            {smsError}
          </p>
        )}
      </div>

      {/* Countdown and Resend */}
      <div className="text-center text-xs text-slate-400">
        {smsCountdown > 0 ? (
          <span>Kodni qayta yuborish: <strong className="font-mono text-slate-700">00:{smsCountdown.toString().padStart(2, '0')}</strong></span>
        ) : (
          <button
            type="button"
            onClick={() => setSmsCountdown(59)}
            className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Kodni qayta yuborish</span>
          </button>
        )}
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmSms}
        className="w-full h-12 rounded-xl text-sm font-bold tracking-wide uppercase text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 select-none"
      >
        <span>Tasdiqlash va to'lash</span>
        <Check className="w-4 h-4" />
      </button>
    </div>
  );

  /* ========================================================
     Step 4: Success Screen with Large QR Code
     Exact Prompt:
     success card "✅ Parking P17 band qilindi", time 18:00–19:00,
     large QR code, text "Kirishda QR ni skanerlang"
     ======================================================== */
  const renderSuccessStep = () => (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-5 animate-in fade-in duration-200">
      {/* State Badge */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          To'lov muvaffaqiyatli yakunlandi
        </span>
        <span className="text-[11px] font-semibold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          <span>Faol chipta</span>
        </span>
      </div>

      {/* Exact Prompt Title: "✅ Parking P17 band qilindi" */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
        <h3 className="text-base font-bold text-emerald-950 font-sans tracking-tight">
          ✅ Parking {selectedSpotCode} band qilindi
        </h3>
      </div>

      {/* Time & Vehicle Details */}
      <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Belgilangan vaqt:
          </span>
          {/* Exact Prompt: "time 18:00–19:00" */}
          <span className="text-sm font-bold text-slate-900 font-mono block mt-0.5">
            {selectedSlot}
          </span>
          <span className="text-[10px] text-slate-500">Bugun, 3-noyabr</span>
        </div>

        <div className="border-l border-slate-200 pl-3">
          <span className="text-[11px] text-slate-400 font-medium block">
            Avtomobil raqami:
          </span>
          <div className="mt-1">
            <UzbekPlate plate={selectedVehicle} size="sm" />
          </div>
        </div>
      </div>

      {/* Payment details pill */}
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500 font-sans">To'lov miqdori:</span>
        <span className="font-bold text-[#2563EB]">
          {formatSom(totalPrice)} (Humo •••• {selectedCard?.last4 || '4421'})
        </span>
      </div>

      {/* Platforma komissiyasi (narx ichida) */}
      <div className="px-2.5 py-2 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Platforma komissiyasi ({commissionPercent}%):</span>
          <span className="font-mono text-slate-800">{formatSom(splitPayment(totalPrice, commissionRate).commission)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Parking egasiga:</span>
          <span className="font-mono text-slate-800">{formatSom(splitPayment(totalPrice, commissionRate).ownerPayout)}</span>
        </div>
      </div>

      {/* Exact Prompt: Large QR Code with center parking shield */}
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-inner">
        <div className="relative w-48 h-48 bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
          {/* High-fidelity Vector QR Code */}
          <svg viewBox="0 0 160 160" className="w-full h-full text-slate-900">
            <rect x="10" y="10" width="40" height="40" fill="currentColor" rx="4" />
            <rect x="18" y="18" width="24" height="24" fill="white" rx="2" />
            <rect x="24" y="24" width="12" height="12" fill="currentColor" rx="1" />

            <rect x="110" y="10" width="40" height="40" fill="currentColor" rx="4" />
            <rect x="118" y="18" width="24" height="24" fill="white" rx="2" />
            <rect x="124" y="24" width="12" height="12" fill="currentColor" rx="1" />

            <rect x="10" y="110" width="40" height="40" fill="currentColor" rx="4" />
            <rect x="18" y="118" width="24" height="24" fill="white" rx="2" />
            <rect x="24" y="124" width="12" height="12" fill="currentColor" rx="1" />

            <rect x="60" y="15" width="8" height="8" fill="currentColor" />
            <rect x="75" y="15" width="8" height="8" fill="currentColor" />
            <rect x="90" y="15" width="8" height="8" fill="currentColor" />

            <rect x="60" y="30" width="8" height="8" fill="currentColor" />
            <rect x="80" y="30" width="8" height="8" fill="currentColor" />
            <rect x="60" y="45" width="8" height="8" fill="currentColor" />
            <rect x="75" y="45" width="8" height="8" fill="currentColor" />
            <rect x="90" y="45" width="8" height="8" fill="currentColor" />

            <rect x="15" y="60" width="8" height="8" fill="currentColor" />
            <rect x="30" y="60" width="8" height="8" fill="currentColor" />
            <rect x="45" y="60" width="8" height="8" fill="currentColor" />
            <rect x="110" y="60" width="8" height="8" fill="currentColor" />
            <rect x="125" y="60" width="8" height="8" fill="currentColor" />
            <rect x="140" y="60" width="8" height="8" fill="currentColor" />

            <rect x="15" y="75" width="8" height="8" fill="currentColor" />
            <rect x="45" y="75" width="8" height="8" fill="currentColor" />
            <rect x="110" y="75" width="8" height="8" fill="currentColor" />
            <rect x="135" y="75" width="8" height="8" fill="currentColor" />

            <rect x="15" y="90" width="8" height="8" fill="currentColor" />
            <rect x="30" y="90" width="8" height="8" fill="currentColor" />
            <rect x="120" y="90" width="8" height="8" fill="currentColor" />
            <rect x="135" y="90" width="8" height="8" fill="currentColor" />

            <rect x="60" y="110" width="8" height="8" fill="currentColor" />
            <rect x="80" y="110" width="8" height="8" fill="currentColor" />
            <rect x="95" y="110" width="8" height="8" fill="currentColor" />
            <rect x="120" y="110" width="8" height="8" fill="currentColor" />

            <rect x="60" y="125" width="8" height="8" fill="currentColor" />
            <rect x="75" y="125" width="8" height="8" fill="currentColor" />
            <rect x="135" y="125" width="8" height="8" fill="currentColor" />

            <rect x="60" y="140" width="8" height="8" fill="currentColor" />
            <rect x="85" y="140" width="8" height="8" fill="currentColor" />
            <rect x="110" y="140" width="8" height="8" fill="currentColor" />
            <rect x="130" y="140" width="8" height="8" fill="currentColor" />

            {/* Center Logo Cutout */}
            <rect x="62" y="62" width="36" height="36" fill="white" rx="6" />
            <rect x="65" y="65" width="30" height="30" fill="#2563EB" rx="4" />
            <text x="80" y="86" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              P
            </text>
          </svg>
        </div>

        {/* Exact Prompt Text: "Kirishda QR ni skanerlang" */}
        <p className="text-sm font-bold text-slate-800 text-center mt-3 tracking-tight">
          Kirishda QR ni skanerlang
        </p>
        <span className="text-[11px] text-slate-400 text-center block mt-0.5">
          Avtomatik shlagbaum kamerasi QR kodni 2 soniyada aniqlaydi
        </span>
      </div>

      {/* Confirmation Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onBackToMap}
          className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Yo'nalish (Xarita)</span>
        </button>

        <button
          onClick={() => {
            setCurrentStep(1);
          }}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Yangi band qilish</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-24 font-sans select-none">
      {/* Top Header: "Rezervatsiya" */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Rezervatsiya
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Toshkent shahar aqlli parkovka joyini to'lov bilan kafolatlash
          </p>
        </div>

        {onBackToMap && (
          <button
            onClick={onBackToMap}
            className="text-xs font-bold text-[#2563EB] hover:underline px-2 py-1 rounded-lg hover:bg-blue-50"
          >
            Xaritaga
          </button>
        )}
      </div>

      {/* State Switcher Tabs: Step wizard vs Both States on one screen */}
      <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs font-semibold">
        <button
          onClick={() => setViewMode('step')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            viewMode === 'step'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          To'lov jarayoni ({currentStep}/3)
        </button>
        <button
          onClick={() => setViewMode('both')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            viewMode === 'both'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Ikkala holat (Split)
        </button>
      </div>

      {/* Screen Body */}
      {viewMode === 'both' ? (
        /* Exact Prompt: "Show as two states on one screen" */
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>{renderSelectionStep()}</div>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-slate-200" />
            </div>
            <div className="relative px-3 bg-slate-100 text-[11px] font-bold text-slate-500 rounded-full py-0.5 border border-slate-200">
              To'lov va tasdiqlashdan so'ng ↓
            </div>
          </div>

          <div>{renderSuccessStep()}</div>
        </div>
      ) : (
        /* Step-by-Step wizard flow */
        <div className="animate-in fade-in duration-150">
          {currentStep === 1 && renderSelectionStep()}
          {currentStep === 2 && renderPaymentStep()}
          {currentStep === 3 && renderSmsStep()}
          {currentStep === 4 && renderSuccessStep()}
        </div>
      )}
    </div>
  );
};
