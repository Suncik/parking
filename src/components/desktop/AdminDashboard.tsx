import React, { useState } from 'react';
import {
  LayoutDashboard,
  SquareParking,
  Users,
  Cpu,
  FileBarChart,
  Search,
  Filter,
  Download,
  Plus,
  AlertTriangle,
  WifiOff,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  MoreVertical,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { StatusBadge } from '../app/StatusBadge';
import { ParkingStatus } from '../../types';

interface OfflineSensor {
  id: string;
  code: string;
  parkingName: string;
  bayNumber: string;
  offlineSince: string;
  issueType: string;
  severity: 'warning' | 'critical';
  batteryLevel: number;
}

interface ParkingAdminRow {
  id: string;
  name: string;
  district: string;
  address: string;
  totalSpots: number;
  freeSpots: number;
  hourlyRate: number;
  status: ParkingStatus;
  onlineSensors: number;
  totalSensors: number;
}

export const AdminDashboard: React.FC<{
  onSwitchToOperator?: () => void;
  onSwitchToMobile?: () => void;
  onOpenDesignSystem?: () => void;
}> = ({ onSwitchToOperator, onSwitchToMobile, onOpenDesignSystem }) => {
  // Sidebar tab: Umumiy ko'rinish, Parkinglar, Foydalanuvchilar, Sensorlar, Hisobotlar
  const [activeTab, setActiveTab] = useState<'overview' | 'parkings' | 'users' | 'sensors' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ParkingStatus>('all');
  const [selectedSensor, setSelectedSensor] = useState<OfflineSensor | null>(null);

  // Exact prompt offline sensors with warning badges
  const [offlineSensors, setOfflineSensors] = useState<OfflineSensor[]>([
    {
      id: 'sns-01',
      code: 'SNS-AT-018',
      parkingName: 'Amir Temur xiyoboni',
      bayNumber: 'Joy P18',
      offlineSince: '14 daqiqa oldin',
      issueType: 'Ultrasonik datchik javob bermayapti',
      severity: 'warning',
      batteryLevel: 6,
    },
    {
      id: 'sns-02',
      code: 'SNS-TC-042',
      parkingName: 'Toshkent City Mall',
      bayNumber: 'Joy B-04',
      offlineSince: '42 daqiqa oldin',
      issueType: 'LoRaWAN gateway aloqasi uzilgan',
      severity: 'critical',
      batteryLevel: 0,
    },
    {
      id: 'sns-03',
      code: 'SNS-CH-105',
      parkingName: 'Chorsu bozori',
      bayNumber: 'Joy A-12',
      offlineSince: '1 soat oldin',
      issueType: 'Kamera linzasi optik to\'silgan',
      severity: 'warning',
      batteryLevel: 78,
    },
    {
      id: 'sns-04',
      code: 'SNS-OY-007',
      parkingName: 'Oybek Biznes Markazi',
      bayNumber: 'Joy -1/15',
      offlineSince: '2 soat oldin',
      issueType: 'Yerosti signal kuchsizligi (-112 dBm)',
      severity: 'warning',
      batteryLevel: 14,
    },
    {
      id: 'sns-05',
      code: 'SNS-EC-089',
      parkingName: 'Ecopark TsUM',
      bayNumber: 'Joy EV-02',
      offlineSince: '3 soat oldin',
      issueType: 'Zaryadlash stantsiyasi telemetriyasi uzilgan',
      severity: 'critical',
      batteryLevel: 45,
    },
  ]);

  // Table of parking lots: Nomi, Manzil, Joylar, Narx, Holat
  const parkingRows: ParkingAdminRow[] = [
    {
      id: 'p-1',
      name: 'Toshkent City Park & Mall',
      district: 'Shayxontohur tumani',
      address: 'Botir Zokirov ko\'chasi, 7',
      totalSpots: 420,
      freeSpots: 175,
      hourlyRate: 8000,
      status: 'free',
      onlineSensors: 418,
      totalSensors: 420,
    },
    {
      id: 'p-2',
      name: 'Amir Temur xiyoboni (Parking #1)',
      district: 'Mirobod tumani',
      address: 'Amir Temur shoh ko\'chasi, 2',
      totalSpots: 50,
      freeSpots: 14,
      hourlyRate: 5000,
      status: 'warning',
      onlineSensors: 48,
      totalSensors: 50,
    },
    {
      id: 'p-3',
      name: 'Chorsu Bozori Avtoturargohi',
      district: 'Olmazor tumani',
      address: 'Zarqaynar ko\'chasi, 14',
      totalSpots: 180,
      freeSpots: 4,
      hourlyRate: 4000,
      status: 'full',
      onlineSensors: 177,
      totalSensors: 180,
    },
    {
      id: 'p-4',
      name: 'TsUM va Navoiy teatri',
      district: 'Yakkasaroy tumani',
      address: 'Zarafshon ko\'chasi, 10',
      totalSpots: 60,
      freeSpots: 28,
      hourlyRate: 6000,
      status: 'free',
      onlineSensors: 60,
      totalSensors: 60,
    },
    {
      id: 'p-5',
      name: 'Toshkent Ecopark & TsUM',
      district: 'Mirzo Ulug\'bek tumani',
      address: 'Makhtumquli ko\'chasi, 79',
      totalSpots: 260,
      freeSpots: 145,
      hourlyRate: 6000,
      status: 'free',
      onlineSensors: 257,
      totalSensors: 260,
    },
    {
      id: 'p-6',
      name: 'Magic City Ko\'ngilochar Bog\'i',
      district: 'Chilonzor tumani',
      address: 'Bobur ko\'chasi, 174',
      totalSpots: 350,
      freeSpots: 38,
      hourlyRate: 7000,
      status: 'warning',
      onlineSensors: 348,
      totalSensors: 350,
    },
    {
      id: 'p-7',
      name: 'Oloy Bozori & Biznes',
      district: 'Mirzo Ulug\'bek tumani',
      address: 'Amir Temur shoh ko\'chasi, 42',
      totalSpots: 80,
      freeSpots: 2,
      hourlyRate: 5000,
      status: 'full',
      onlineSensors: 80,
      totalSensors: 80,
    },
    {
      id: 'p-8',
      name: 'Oybek Biznes Markazi',
      district: 'Yakkasaroy tumani',
      address: 'Afrosiyob ko\'chasi, 4B',
      totalSpots: 210,
      freeSpots: 115,
      hourlyRate: 6000,
      status: 'free',
      onlineSensors: 208,
      totalSensors: 210,
    },
  ];

  const filteredParkings = parkingRows.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRebootSensor = (id: string) => {
    setOfflineSensors((prev) => prev.filter((s) => s.id !== id));
    alert("Sensor qayta yuklandi va tarmoqqa ulandi!");
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex antialiased">
      {/* 1. Sidebar (Fixed 260px) */}
      {/* Exact Sidebar Items: Umumiy ko'rinish, Parkinglar, Foydalanuvchilar, Sensorlar, Hisobotlar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Brand Lockup: "Smart Parking Admin" */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-base shadow-sm">
                SP
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  Smart Parking
                </h1>
                <span className="text-[11px] font-bold text-[#2563EB] mt-1 block">
                  Admin Konsoli
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Nav: Umumiy ko'rinish, Parkinglar, Foydalanuvchilar, Sensorlar, Hisobotlar */}
          <nav className="p-4 space-y-1">
            {/* 1. Umumiy ko'rinish */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Umumiy ko'rinish</span>
            </button>

            {/* 2. Parkinglar */}
            <button
              onClick={() => setActiveTab('parkings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'parkings'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <SquareParking className="w-4 h-4" />
              <span>Parkinglar</span>
            </button>

            {/* 3. Foydalanuvchilar */}
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Foydalanuvchilar</span>
            </button>

            {/* 4. Sensorlar */}
            <button
              onClick={() => setActiveTab('sensors')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'sensors'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4" />
                <span>Sensorlar</span>
              </div>
              {offlineSensors.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                  {offlineSensors.length}
                </span>
              )}
            </button>

            {/* 5. Hisobotlar */}
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reports'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileBarChart className="w-4 h-4" />
              <span>Hisobotlar</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Administrative user */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Toshkent Sh. Raqamlashtirish
            </span>
            <span className="text-xs font-semibold text-slate-700 block">
              Server holati: 99.98% SLA
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">
                Toshkent Sh. Hokimligi
              </span>
              <span className="text-[11px] text-slate-400 block truncate">
                Bosh Administrator
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
              Smart Parking Admin
            </span>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <h2 className="text-sm font-bold text-slate-900 capitalize">
              {activeTab === 'overview' ? "Umumiy ko'rinish" : activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>IoT Tarmoq: 1 428 sensor faol</span>
            </div>

            <button
              onClick={() => {
                alert("Toshkent shahar avtoturargohlari to'liq hisoboti yuklab olinmoqda (Excel/CSV)...");
              }}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Hisobotni yuklash</span>
            </button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Exact Prompt: Cards (4 key metrics):
              1. Jami parkinglar
              2. Faol foydalanuvchilar
              3. Online sensorlar
              4. Oylik daromad
          */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Jami parkinglar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Jami parkinglar
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <SquareParking className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight tabular-nums">
                    18
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    ta majmua
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-1">
                  Toshkentning 7 ta markaziy tumanida
                </span>
              </div>
            </div>

            {/* Card 2: Faol foydalanuvchilar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Faol foydalanuvchilar
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight tabular-nums">
                    48 320
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">
                    +12% oy
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-1">
                  Ro'yxatdan o'tgan haydovchilar
                </span>
              </div>
            </div>

            {/* Card 3: Online sensorlar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>Online sensorlar</span>
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-[#16A34A] tracking-tight tabular-nums">
                    1 428
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    / 1 450 ta
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  98.5% aloqa barqarorligi
                </span>
              </div>
            </div>

            {/* Card 4: Oylik daromad */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Oylik daromad
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-mono text-[#2563EB] tracking-tight tabular-nums">
                    248.5 mln
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    so'm
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-1">
                  Shahar g'aznasiga tushum
                </span>
              </div>
            </div>
          </section>

          {/* Operational Area: 2 Columns Split */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Table of Parking Lots (nomi, manzil, joylar, narx, holat) */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden space-y-4 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Avtoturargohlar Ro'yxati
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Toshkent shahridagi rasmiy munitsipal aqlli avtoturargohlar holati
                  </p>
                </div>

                {/* Filter and Search */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Qidirish..."
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2563EB] w-40 sm:w-48"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Barcha holatlar</option>
                    <option value="free">Bo'sh</option>
                    <option value="warning">Deyarli to'la</option>
                    <option value="full">To'la</option>
                  </select>
                </div>
              </div>

              {/* Exact Prompt Table: (nomi, manzil, joylar, narx, holat) */}
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Nomi</th>
                      <th className="py-3 px-4">Manzil</th>
                      <th className="py-3 px-4 text-center">Joylar (Bo'sh / Jami)</th>
                      <th className="py-3 px-4 text-right">Narx</th>
                      <th className="py-3 px-4 text-center">Holat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredParkings.map((p) => {
                      const occupancyPct = Math.round(((p.totalSpots - p.freeSpots) / p.totalSpots) * 100);

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        >
                          {/* Nomi */}
                          <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                            <span className="block truncate max-w-[200px]">{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {p.onlineSensors} / {p.totalSensors} sensor online
                            </span>
                          </td>

                          {/* Manzil */}
                          <td className="py-3 px-4 text-slate-500">
                            <span className="block truncate max-w-[220px]">{p.address}</span>
                            <span className="text-[10px] text-slate-400">{p.district}</span>
                          </td>

                          {/* Joylar */}
                          <td className="py-3 px-4 text-center font-mono tabular-nums">
                            <span className="font-bold text-slate-900">{p.freeSpots}</span>
                            <span className="text-slate-400"> / {p.totalSpots}</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  p.status === 'free'
                                    ? 'bg-[#16A34A]'
                                    : p.status === 'warning'
                                    ? 'bg-[#EAB308]'
                                    : 'bg-[#DC2626]'
                                }`}
                                style={{ width: `${occupancyPct}%` }}
                              />
                            </div>
                          </td>

                          {/* Narx */}
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                            {p.hourlyRate.toLocaleString('uz-UZ')} so'm
                            <span className="text-[10px] text-slate-400 block font-sans font-normal">
                              soatiga
                            </span>
                          </td>

                          {/* Holat */}
                          <td className="py-3 px-4 text-center">
                            <StatusBadge status={p.status} size="sm" />
                          </td>
                        </tr>
                      );
                    })}

                    {filteredParkings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                          Qidiruv shartiga mos avtoturargoh topilmadi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 4 Columns: List of Offline Sensors with Warning Badges */}
            <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-rose-500" />
                    <span>Offline Sensorlar</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Aloqadan uzilgan sensorlar ro'yxati
                  </p>
                </div>

                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {offlineSensors.length} ta nosoz
                </span>
              </div>

              {/* Offline Sensors List */}
              <div className="space-y-3">
                {offlineSensors.map((sensor) => {
                  const isCritical = sensor.severity === 'critical';

                  return (
                    <div
                      key={sensor.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCritical
                          ? 'border-rose-200 bg-rose-50/40'
                          : 'border-amber-200 bg-amber-50/40'
                      }`}
                    >
                      {/* Top Header: Sensor Code & Warning Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold font-mono text-slate-900 block">
                            {sensor.code}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {sensor.parkingName} · {sensor.bayNumber}
                          </span>
                        </div>

                        {/* Warning Badges: ⚠️ Offline, Severity */}
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                              isCritical
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>{isCritical ? 'Kritik Uzilish' : 'Offline'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Issue Description */}
                      <p className="text-xs text-slate-700 mt-2 font-medium">
                        {sensor.issueType}
                      </p>

                      {/* Diagnostic details & Reboot button */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{sensor.offlineSince}</span>
                        </span>

                        <button
                          onClick={() => handleRebootSensor(sensor.id)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-sans font-semibold text-xs flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-[#2563EB]" />
                          <span>Qayta ulash</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {offlineSensors.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto mb-2" />
                    <span className="font-bold text-slate-700 block">Barcha sensorlar onlayn!</span>
                    <span>Hozirda hech qanday nosozlik kuzatilmayapti.</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
