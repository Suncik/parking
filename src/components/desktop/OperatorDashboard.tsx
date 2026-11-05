import { OwnerSubscriptionCard } from '../subscription/OwnerSubscriptionCard';
import { OwnerParkingsCard } from './OwnerParkingsCard';
import { COMMISSION_PERCENT, splitPayment, formatSom } from '../../utils/commission';
import React, { useState } from 'react';
import { UzbekPlate } from '../app/UzbekPlate';
import {
  LayoutDashboard,
  SquareParking,
  TrendingUp,
  Settings,
  Car,
  Clock,
  ArrowUpRight,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Zap,
  Calendar,
  LogOut,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Search,
} from 'lucide-react';

interface OperatorSpot {
  id: string;
  status: 'free' | 'occupied';
  plate?: string;
  time?: string;
  rate: number;
}

interface OperatorDashboardProps {
  onSwitchToMobileApp?: () => void;
  onOpenDesignSystem?: () => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  onSwitchToMobileApp,
  onOpenDesignSystem,
}) => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<'dashboard' | 'spots' | 'revenue' | 'settings'>('dashboard');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'this-week' | 'last-week'>('this-week');

  // Exact prompt weekly occupancy data (%):
  // Dush 65, Sesh 72, Chor 80, Pay 85, Jum 92, Shan 60, Yak 40
  const weeklyData = [
    { day: 'Dush', fullDay: 'Dushanba', value: 65, peak: '18:30', cars: 65 },
    { day: 'Sesh', fullDay: 'Seshanba', value: 72, peak: '17:45', cars: 72 },
    { day: 'Chor', fullDay: 'Chorshanba', value: 80, peak: '18:15', cars: 80 },
    { day: 'Pay', fullDay: 'Payshanba', value: 85, peak: '19:00', cars: 85 },
    { day: 'Jum', fullDay: 'Juma', value: 92, peak: '19:30', cars: 92 },
    { day: 'Shan', fullDay: 'Shanba', value: 60, peak: '14:20', cars: 60 },
    { day: 'Yak', fullDay: 'Yakshanba', value: 40, peak: '13:00', cars: 40 },
  ];

  // Exact prompt spots P01 - P20 (each green or red)
  // Overall ratio: 27% free, 73% band. In 20 spots: ~5-6 green (free), ~14-15 red (band)
  const initialSpots: OperatorSpot[] = [
    { id: 'P01', status: 'occupied', plate: '01 A 777 AA', time: '1 soat 12 daq', rate: 5000 },
    { id: 'P02', status: 'free', plate: undefined, time: undefined, rate: 5000 },
    { id: 'P03', status: 'occupied', plate: '01 010 RAA', time: '45 daq', rate: 5000 },
    { id: 'P04', status: 'occupied', plate: '10 B 123 CD', time: '2 soat 05 daq', rate: 5000 },
    { id: 'P05', status: 'occupied', plate: '01 700 VAA', time: '30 daq', rate: 5000 },
    { id: 'P06', status: 'occupied', plate: '01 909 TAS', time: '1 soat 40 daq', rate: 5000 },
    { id: 'P07', status: 'free', plate: undefined, time: undefined, rate: 5000 },
    { id: 'P08', status: 'occupied', plate: '01 555 UZB', time: '3 soat 10 daq', rate: 5000 },
    { id: 'P09', status: 'occupied', plate: '01 333 SAM', time: '55 daq', rate: 5000 },
    { id: 'P10', status: 'occupied', plate: '01 888 MBA', time: '2 soat 20 daq', rate: 5000 },
    { id: 'P11', status: 'free', plate: undefined, time: undefined, rate: 5000 },
    { id: 'P12', status: 'occupied', plate: '01 404 BUK', time: '15 daq', rate: 5000 },
    { id: 'P13', status: 'occupied', plate: '10 A 999 AA', time: '1 soat 50 daq', rate: 5000 },
    { id: 'P14', status: 'occupied', plate: '01 222 FER', time: '4 soat 00 daq', rate: 5000 },
    { id: 'P15', status: 'free', plate: undefined, time: undefined, rate: 5000 },
    { id: 'P16', status: 'occupied', plate: '01 111 AND', time: '1 soat 05 daq', rate: 5000 },
    { id: 'P17', status: 'occupied', plate: '01 A 777 AA', time: 'Rezervatsiya (18:00)', rate: 5000 },
    { id: 'P18', status: 'occupied', plate: '01 678 NAM', time: '2 soat 45 daq', rate: 5000 },
    { id: 'P19', status: 'free', plate: undefined, time: undefined, rate: 5000 },
    { id: 'P20', status: 'occupied', plate: '01 789 NAV', time: '35 daq', rate: 5000 },
  ];

  const [spots, setSpots] = useState<OperatorSpot[]>(initialSpots);

  const selectedSpot = spots.find((s) => s.id === selectedSpotId);

  const toggleSpotStatus = (id: string) => {
    setSpots((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'free' ? 'occupied' : 'free';
          return {
            ...s,
            status: nextStatus,
            plate: nextStatus === 'occupied' ? '01 777 TAS' : undefined,
            time: nextStatus === 'occupied' ? 'Hozir kirdi' : undefined,
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex antialiased">
      {/* 1. Left Sidebar (Fixed 260px) */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Brand Header: "Central Parking" */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-base shadow-sm">
                P
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  Central Parking
                </h1>
                <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
                  Dispetcher Paneli
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveSidebarTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebarTab === 'dashboard'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* 2. Parking joylari */}
            <button
              onClick={() => setActiveSidebarTab('spots')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebarTab === 'spots'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <SquareParking className="w-4 h-4" />
              <span>Parking joylari</span>
            </button>

            {/* 3. Daromad */}
            <button
              onClick={() => setActiveSidebarTab('revenue')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebarTab === 'revenue'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Daromad</span>
            </button>

            {/* 4. Sozlamalar */}
            <button
              onClick={() => setActiveSidebarTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebarTab === 'settings'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Sozlamalar</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Operator Info & Switch to Mobile View */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {onSwitchToMobileApp && (
            <button
              onClick={onSwitchToMobileApp}
              className="w-full py-2 px-3 text-xs font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Mobil haydovchi ilovasi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center gap-3 pt-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              SR
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">
                Sardor Rahimov
              </span>
              <span className="text-[11px] text-slate-400 block truncate">
                Katta navbatchi dispetcher
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">
              Boshqaruv / Central Parking
            </span>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <h2 className="text-sm font-bold text-slate-900">
              Asosiy Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Avtoturargoh tizimi onlayn</span>
            </div>

            <button
              onClick={() => {
                alert("Hisobot PDF formatida tayyorlanmoqda...");
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Eksport</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Exact Prompt: Top Stat Cards (4 cards):
              1. Jami joy 100
              2. Bo'sh 27 (green)
              3. Band 73 (red)
              4. Bugungi daromad 1 250 000 so'm
          */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Jami joy 100 */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Jami joy
                </span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <SquareParking className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight tabular-nums">
                  100
                </span>
                <span className="text-xs text-slate-400 font-medium block mt-1">
                  Avtoturargoh umumiy sig'imi
                </span>
              </div>
            </div>

            {/* Card 2: Bo'sh 27 (green) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>Bo'sh</span>
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold font-mono text-[#16A34A] tracking-tight tabular-nums">
                  27
                </span>
                <span className="text-xs text-emerald-700 font-semibold block mt-1">
                  27% joy erkin mavjud
                </span>
              </div>
            </div>

            {/* Card 3: Band 73 (red) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                  <span>Band</span>
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#DC2626] flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold font-mono text-[#DC2626] tracking-tight tabular-nums">
                  73
                </span>
                <span className="text-xs text-rose-700 font-semibold block mt-1">
                  73% joy band qilingan
                </span>
              </div>
            </div>

            {/* Card 4: Bugungi daromad 1 250 000 so'm */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Bugungi daromad
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold font-mono text-[#2563EB] tracking-tight tabular-nums">
                  1 250 000 so'm
                </span>
                <span className="text-xs text-slate-500 font-medium block mt-1">
                  +14% o'tgan kunga nisbatan
                </span>
                <span className="text-[11px] text-slate-500 font-medium block mt-1">
                  Komissiya ({COMMISSION_PERCENT}%): −{formatSom(splitPayment(1_250_000).commission)} · Sizga: {formatSom(splitPayment(1_250_000).ownerPayout)}
                </span>
              </div>
            </div>
          </section>

          {/* Business tarifi (parking egalari uchun obuna) */}
          <OwnerParkingsCard />

          <OwnerSubscriptionCard />

          {/* Operational Area: 2 Columns Split */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Bar Chart "Haftalik bandlik (%)" */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Haftalik bandlik (%)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hafta kunlari bo'yicha bandlik darajasi tahlili
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setTimeframe('this-week')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      timeframe === 'this-week'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ushbu hafta
                  </button>
                  <button
                    onClick={() => setTimeframe('last-week')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      timeframe === 'last-week'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    O'tgan hafta
                  </button>
                </div>
              </div>

              {/* Bar Chart Canvas */}
              {/* Exact Prompt: Dush 65, Sesh 72, Chor 80, Pay 85, Jum 92, Shan 60, Yak 40 */}
              <div className="pt-4">
                {/* 100% and 50% guideline lines */}
                <div className="relative h-64 w-full flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6 border-b border-slate-200">
                  {/* Grid horizontal guidelines */}
                  <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-200 flex justify-end pr-2 text-[10px] text-slate-400 font-mono">
                    100%
                  </div>
                  <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-200 flex justify-end pr-2 text-[10px] text-slate-400 font-mono">
                    75%
                  </div>
                  <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-200 flex justify-end pr-2 text-[10px] text-slate-400 font-mono">
                    50%
                  </div>
                  <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-200 flex justify-end pr-2 text-[10px] text-slate-400 font-mono">
                    25%
                  </div>

                  {/* 80% Peak load indicator line */}
                  <div
                    className="absolute inset-x-0 border-b-2 border-dashed border-rose-300 pointer-events-none z-10"
                    style={{ bottom: '80%' }}
                  >
                    <span className="absolute right-2 -top-4 text-[9px] font-bold text-[#DC2626] bg-rose-50 px-1.5 py-0.5 rounded">
                      Yuklama chegarasi: 80%
                    </span>
                  </div>

                  {/* Weekly Bars */}
                  {weeklyData.map((item) => {
                    const isPeak = item.value >= 80;
                    const barColor = item.value >= 85 ? '#DC2626' : item.value >= 70 ? '#2563EB' : '#16A34A';

                    return (
                      <div
                        key={item.day}
                        className="flex-1 h-full flex flex-col justify-end items-center group relative z-20"
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-12 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                          <span>{item.fullDay}: </span>
                          <strong className="font-mono">{item.value}%</strong>
                          <span className="text-slate-400 ml-1">({item.cars} ta mashina)</span>
                        </div>

                        {/* Bar Percentage Text above bar */}
                        <span className="text-xs font-bold font-mono tabular-nums text-slate-700 mb-2 transition-transform group-hover:-translate-y-1">
                          {item.value}%
                        </span>

                        {/* Bar Body */}
                        <div
                          className="w-full max-w-[44px] rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-xs"
                          style={{
                            height: `${item.value}%`,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Day Labels below chart */}
                <div className="flex items-center justify-between gap-3 sm:gap-6 px-2 sm:px-6 pt-3 text-xs font-bold text-slate-600">
                  {weeklyData.map((item) => (
                    <div key={item.day} className="flex-1 text-center font-sans">
                      <span className="block">{item.day}</span>
                      <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
                        {item.value >= 80 ? 'Yuqori' : 'Normal'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Insights Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#16A34A]" />
                    <span>Qulay (&lt;70%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" />
                    <span>O'rtacha (70–84%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]" />
                    <span>Eng yuqori (≥85%)</span>
                  </div>
                </div>

                <span className="text-slate-600 font-semibold font-mono">
                  O'rtacha bandlik: 70.6%
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Live Grid of Parking Spots P01–P20 */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Jonli joylar holati (P01 – P20)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Har bir joy: yashil (bo'sh) yoki qizil (band)
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                    <span className="text-emerald-800">Bo'sh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                    <span className="text-rose-800">Band</span>
                  </div>
                </div>
              </div>

              {/* Exact Prompt: Live Grid of Parking Spots P01–P20, each green or red */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {spots.map((spot) => {
                  const isFree = spot.status === 'free';
                  const isSelected = selectedSpotId === spot.id;

                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedSpotId(spot.id)}
                      className={`h-16 rounded-xl border-2 flex flex-col items-center justify-center p-1.5 transition-all relative select-none ${
                        isSelected
                          ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 z-10'
                          : 'hover:scale-102'
                      } ${
                        isFree
                          ? 'bg-emerald-50/70 border-[#16A34A] text-emerald-950'
                          : 'bg-rose-50/70 border-[#DC2626] text-rose-950'
                      }`}
                    >
                      {/* Spot code: P01, P02... P20 */}
                      <span className="text-xs font-black font-mono tracking-wider">
                        {spot.id}
                      </span>

                      {/* Small Status Pill */}
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                          isFree
                            ? 'bg-[#16A34A] text-white'
                            : 'bg-[#DC2626] text-white'
                        }`}
                      >
                        {isFree ? "Bo'sh" : "Band"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Spot Telemetry Inspection Box */}
              {selectedSpot ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold font-mono text-slate-900">
                        Joy {selectedSpot.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          selectedSpot.status === 'free'
                            ? 'bg-emerald-100 text-[#16A34A]'
                            : 'bg-rose-100 text-[#DC2626]'
                        }`}
                      >
                        {selectedSpot.status === 'free' ? "Bo'sh joy" : "Band qilingan"}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSpotStatus(selectedSpot.id)}
                      className="text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      Holatni almashtirish
                    </button>
                  </div>

                  {selectedSpot.status === 'occupied' ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Avtomobil raqami:</span>
                        <UzbekPlate plate={selectedSpot.plate || '01 A 777 AA'} size="sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">To'xtash muddati:</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {selectedSpot.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Tarif:</span>
                        <span className="font-mono font-bold text-slate-900">
                          5 000 so'm/soat
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Ushbu joy ayni paytda bo'sh. Yangi kelgan avtomobil to'xtashi yoki onlayn band qilinishi mumkin.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                  Joy haqida to'liq ma'lumot olish uchun yuqoridagi P01–P20 katakchalaridan birini bosing.
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
