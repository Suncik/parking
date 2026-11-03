import React, { useState } from 'react';
import { SavedCard } from '../../types';
import { formatCardNumber, formatExpiry, detectCardType } from '../../data/savedCards';
import { X, CreditCard, ShieldCheck, Check } from 'lucide-react';

interface AddCardModalProps {
  onClose: () => void;
  onAddCard: (card: SavedCard) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({ onClose, onAddCard }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [bankName, setBankName] = useState('O\'zbekiston Milliy Banki');
  const [isPrimary, setIsPrimary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardType = detectCardType(cardNumber);
  const cleanDigits = cardNumber.replace(/\D/g, '');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (error) setError(null);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanDigits.length < 16) {
      setError('Karta raqami 16 ta raqamdan iborat bo\'lishi kerak');
      return;
    }
    if (expiry.length < 5) {
      setError('Amal qilish muddatini MM/YY formatida kiriting (masalan, 08/28)');
      return;
    }

    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      type: cardType,
      number: cardNumber,
      last4: cleanDigits.slice(-4),
      expiry,
      isPrimary,
      bankName: bankName.trim() || (cardType === 'humo' ? 'Humo Karta' : 'Uzcard Karta'),
    };

    onAddCard(newCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Karta qo'shish</h3>
              <p className="text-[11px] text-slate-400">Uzcard yoki Humo bank kartasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Card Preview Banner */}
          <div
            className={`p-4 rounded-xl text-white shadow-sm flex flex-col justify-between h-28 relative overflow-hidden transition-all ${
              cardType === 'humo'
                ? 'bg-gradient-to-tr from-amber-600 to-amber-400'
                : 'bg-gradient-to-tr from-blue-700 to-blue-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider opacity-90">
                {cardType === 'humo' ? 'HUMO CARD' : 'UZCARD'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 uppercase">
                {cardType.toUpperCase()}
              </span>
            </div>

            <div className="font-mono font-bold tracking-widest text-sm text-center">
              {cardNumber || '8600 •••• •••• ••••'}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="opacity-80">MUDDATI: {expiry || 'MM/YY'}</span>
              <span className="font-sans text-[10px] opacity-90 truncate max-w-[120px]">
                {bankName}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}

          {/* Card Number Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Karta raqami:
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="8600 0000 0000 0000"
                maxLength={19}
                className="w-full px-3.5 py-2.5 text-sm font-mono font-bold tracking-wider rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-100 placeholder:text-slate-300"
                autoFocus
              />
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  cardType === 'humo'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-[#2563EB]'
                }`}
              >
                {cardType.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Expiry and Bank */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amal qilish muddati:
              </label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-3 py-2 text-xs font-mono font-bold text-center rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank nomi:
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Masalan, Kapitalbank"
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Primary card checkbox */}
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded border-slate-300 focus:ring-[#2563EB]"
            />
            <span className="text-xs text-slate-600 font-medium">
              Asosiy to'lov kartasi sifatida saqlash
            </span>
          </label>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs transition-colors"
            >
              Kartani saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
