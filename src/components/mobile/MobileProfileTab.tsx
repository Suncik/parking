import React, { useState } from 'react';
import { UzbekPlate } from '../app/UzbekPlate';
import { SavedCard } from '../../types';
import { AddCardModal } from './AddCardModal';
import {
  User,
  Car,
  CreditCard,
  Plus,
  Palette,
  ChevronRight,
  Check,
  ShieldCheck,
  Star,
  Trash2,
} from 'lucide-react';

interface MobileProfileTabProps {
  savedCards: SavedCard[];
  onAddCard: (card: SavedCard) => void;
  onSetPrimaryCard: (id: string) => void;
  onOpenDesignSystem: () => void;
}

export const MobileProfileTab: React.FC<MobileProfileTabProps> = ({
  savedCards,
  onAddCard,
  onSetPrimaryCard,
  onOpenDesignSystem,
}) => {
  const [plates, setPlates] = useState(['01 A 777 AA', '01 010 RAA']);
  const [selectedPlate, setSelectedPlate] = useState('01 A 777 AA');
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  return (
    <div className="p-4 space-y-4 pb-24 max-w-md mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg shadow-sm">
          A
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Anvar Karimov
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            +998 (90) 123-45-67
          </p>
          <span className="text-[11px] font-semibold text-[#16A34A] block mt-0.5">
            Tasdiqlangan haydovchi · Toshkent
          </span>
        </div>
      </div>

      {/* Saved Vehicles */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Mening Avtomobillarim
          </h3>
          <span className="text-xs text-[#2563EB] font-bold cursor-pointer hover:underline">
            + Yangi raqam
          </span>
        </div>

        <div className="space-y-2">
          {plates.map((plate) => (
            <div
              key={plate}
              onClick={() => setSelectedPlate(plate)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedPlate === plate
                  ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 text-slate-500" />
                <UzbekPlate plate={plate} size="sm" />
              </div>
              {selectedPlate === plate && (
                <Check className="w-4 h-4 text-[#2563EB]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exact Prompt: To'lov Usullari with Saved Cards, Uzcard/Humo Badge, Last 4 digits, "+ Karta qo'shish" button */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            To'lov Usullari
          </h3>
          {/* Exact Prompt: "+ Karta qo'shish" button that opens a form modal */}
          <button
            onClick={() => setIsAddCardOpen(true)}
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Karta qo'shish</span>
          </button>
        </div>

        {/* Saved Cards List */}
        <div className="space-y-2.5">
          {savedCards.map((card) => {
            const isHumo = card.type === 'humo';

            return (
              <div
                key={card.id}
                onClick={() => onSetPrimaryCard(card.id)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  card.isPrimary
                    ? 'border-[#2563EB] bg-blue-50/30 ring-1 ring-[#2563EB]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Uzcard/Humo Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      isHumo
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-[#2563EB] border border-blue-300'
                    }`}
                  >
                    {isHumo ? 'HUMO' : 'UZCARD'}
                  </span>

                  <div>
                    {/* Last 4 Digits */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-slate-900">
                        •••• {card.last4}
                      </span>
                      {card.isPrimary && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#16A34A] text-white">
                          Asosiy
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      {card.bankName} · {card.expiry}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {card.isPrimary ? (
                    <span className="text-xs font-semibold text-[#2563EB] flex items-center gap-1">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetPrimaryCard(card.id);
                      }}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 px-2 py-1"
                    >
                      Asosiy qilish
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Other Digital Wallets in Tashkent */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Elektron Hamyonlar
          </span>

          <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00CCCC]" />
              <span className="font-semibold text-slate-800">Payme</span>
            </div>
            <span className="text-[11px] text-[#16A34A] font-semibold">Ulangan</span>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0085FF]" />
              <span className="font-semibold text-slate-800">Click Up</span>
            </div>
            <span className="text-[11px] text-[#16A34A] font-semibold">Ulangan</span>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7000FF]" />
              <span className="font-semibold text-slate-800">Uzum Bank</span>
            </div>
            <span className="text-[11px] text-[#16A34A] font-semibold">Ulangan</span>
          </div>
        </div>
      </div>

      {/* Design System Inspection Button */}
      <button
        onClick={onOpenDesignSystem}
        className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Dizayn Tizimi Ko'rgazmasi
            </h4>
            <p className="text-[11px] text-slate-500">
              Ranglar, 16px kartalar, Inter shrifti va tokenlar
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* Add Card Form Modal */}
      {isAddCardOpen && (
        <AddCardModal
          onClose={() => setIsAddCardOpen(false)}
          onAddCard={(newCard) => {
            onAddCard(newCard);
          }}
        />
      )}
    </div>
  );
};
