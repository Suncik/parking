import React, { useState } from 'react';
import { COLOR_TOKENS, TYPOGRAPHY_TOKENS, ELEVATION_TOKENS } from '../../data/designTokens';
import { UzbekPlate } from '../app/UzbekPlate';
import { StatusBadge } from '../app/StatusBadge';
import { Check, Copy, Layers, Type, Palette, Box, Code, Sparkles, Zap, Accessibility, ShieldCheck } from 'lucide-react';

export const DesignSystemView: React.FC = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'cards' | 'components' | 'tokens'>('colors');
  
  // Interactive Component Sandbox States
  const [demoPlate, setDemoPlate] = useState('01 A 777 AA');
  const [demoSpotStatus, setDemoSpotStatus] = useState<'free' | 'occupied'>('free');
  const [demoSpotType, setDemoSpotType] = useState<'standard' | 'ev' | 'disabled'>('ev');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Design System Hero Header */}
      <div className="sp-card p-6 sm:p-8 bg-white border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
              Dizayn Tizimi v1.0
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Toshkent Shahar Aqlli Avtoturargoh
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            "Smart Parking" Dizayn Tizimi
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Toshkent shahar avtoturargoh ilovasi uchun toza, zamonaviy va funksional UI qoidalari.
            Oq fon, 16px radiusli yumshoq soyali kartalar, Inter shrifti, va shahar parkovkasi uchun
            aniq semantik status ranglari (#16A34A bo'sh, #EAB308 deyarli to'lgan, #DC2626 to'la).
          </p>
        </div>

        {/* Quick Highlights Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 shrink-0 space-y-2 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Asosiy Qoidalar
          </span>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            <span>Asosiy: <strong className="font-mono">#2563EB</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            <span>Bo'sh: <strong className="font-mono">#16A34A</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
            <span>Deyarli to'la: <strong className="font-mono">#EAB308</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <span>To'lgan: <strong className="font-mono">#DC2626</strong></span>
          </div>
          <div className="pt-1 border-t border-slate-200 text-slate-600">
            <span>Radius: <strong className="font-mono">16px</strong> · Shrift: <strong className="font-mono">Inter</strong></span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'colors'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>1. Ranglar Palitrasi</span>
        </button>

        <button
          onClick={() => setActiveTab('typography')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'typography'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Type className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>2. Inter Tipografiya</span>
        </button>

        <button
          onClick={() => setActiveTab('cards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'cards'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>3. 16px Kartalar va Soyalar</span>
        </button>

        <button
          onClick={() => setActiveTab('components')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'components'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>4. Komponentlar Laboratoriyasi</span>
        </button>

        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'tokens'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>5. Tokenlarni Eksport Qilish</span>
        </button>
      </div>

      {/* Tab 1: Colors */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Ranglar Tizimi (Color Tokens)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Oq fon ustida 60-30-10 nisbati: 60% oq va neytral, 30% struktura va matn, 10% asosiy ko'k va statuslar.
              </p>
            </div>
            {copiedToken && (
              <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{copiedToken} nusxalandi!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.variable}
                className="sp-card overflow-hidden bg-white border border-slate-100 flex flex-col justify-between"
              >
                {/* Swatch */}
                <div
                  className="h-28 w-full relative flex items-end p-3 transition-transform hover:scale-102"
                  style={{ backgroundColor: token.hex }}
                >
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      token.hex === '#FFFFFF' || token.hex === '#EAB308' || token.hex === '#E2E8F0'
                        ? 'bg-black/80 text-white'
                        : 'bg-white/90 text-slate-900'
                    }`}
                  >
                    {token.hex}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {token.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {token.variable}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {token.role}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      rgb({token.rgb})
                    </span>
                    <button
                      onClick={() => copyToClipboard(token.hex, token.name)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                      title="HEX kodni nusxalash"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Mapping Callout */}
          <div className="sp-card p-5 bg-white border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Avtoturargoh Holatlari Uchun Status Ranglari Qoidasi:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
                  <strong className="text-xs font-bold text-emerald-900">
                    Yashil (#16A34A) = Bo'sh joylar yetarli
                  </strong>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Avtoturargohda 25% dan ortiq joy erkin. Haydovchi erkin kirib joy topishi mumkin.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EAB308]" />
                  <strong className="text-xs font-bold text-amber-900">
                    Sariq (#EAB308) = Deyarli to'lgan
                  </strong>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Bo'sh joylar 5% dan 25% gacha qolgan. Ilova haydovchiga oldindan band qilishni tavsiya qiladi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#DC2626]" />
                  <strong className="text-xs font-bold text-rose-900">
                    Qizil (#DC2626) = To'lgan / Band
                  </strong>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Avtoturargoh to'liq band (5% dan kam). Kirish cheklangan, tizim boshqa yaqin joyni taklif etadi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Typography */}
      {activeTab === 'typography' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Inter Shrift Tizimi (Typography Hierarchy)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Google Fonts orqali yuklangan toza va zamonaviy Inter font oilasi. Raqamlar uchun tabulyar tekislanish.
            </p>
          </div>

          <div className="sp-card bg-white border border-slate-100 overflow-hidden divide-y divide-slate-100">
            {TYPOGRAPHY_TOKENS.map((t, idx) => (
              <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="md:w-1/3">
                  <span className="text-xs font-bold text-slate-900 block">
                    {t.level}
                  </span>
                  <div className="text-[11px] text-slate-500 space-x-2 mt-0.5 font-mono">
                    <span>{t.size}</span>
                    <span>·</span>
                    <span>{t.weight}</span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {t.usage}
                  </span>
                </div>

                <div className="flex-1">
                  <p
                    className="text-slate-900 tracking-tight"
                    style={{
                      fontSize: t.size.split(' ')[0],
                      fontWeight: t.weight.includes('Bold 700') ? 700 : t.weight.includes('600') ? 600 : 400,
                      lineHeight: t.lineHeight,
                    }}
                  >
                    {t.sample}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Cards & Shadows */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              16px Radiusli Kartalar va Yumshoq Soyalar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Foydalanuvchi talabiga ko'ra: yumaloqlashtirilgan kartalar (16px), yumshoq kunduzgi soyalar, oq fon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Default 16px Card */}
            <div className="sp-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
                  <Box className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Standart 16px Karta
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  border-radius: 16px (rounded-2xl)
                </p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Asosiy statik konteynerlar, ma'lumot bloklari va bo'limlar uchun qo'llaniladi.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                .sp-card {'{ border-radius: 16px; }'}
              </div>
            </div>

            {/* Card 2: Interactive Hover Card */}
            <div className="sp-card-interactive p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Interaktiv 16px Karta
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  hover: translateY(-2px) & shadow-soft-lg
                </p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Bosiladigan avtoturargoh kartalari, tanlov ro'yxatlari va tezkor harakatlar uchun.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                .sp-card-interactive:hover
              </div>
            </div>

            {/* Card 3: Nested Radius Rule */}
            <div className="sp-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Ichki Radius Matematikasi
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  r_ichki = r_tashqi - padding
                </p>
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-700 block">
                    12px ichki element (rounded-xl)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    16px tashqi karta ichida 4px padding bilan uyg'unlashadi.
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                padding: 16px / 20px
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Components Laboratory */}
      {activeTab === 'components' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Komponentlar Laboratoriyasi (Component Sandbox)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Smart Parking tizimining barcha interaktiv elementlarini jonli sinab ko'rish maydoni.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sandbox 1: Uzbek Vehicle License Plate */}
            <div className="sp-card p-5 bg-white space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                1. O'zbekiston Davlat Avtoraqami (Uzbek License Plate)
              </h3>
              <p className="text-xs text-slate-500">
                Toshkent va viloyatlar uchun davlat standarti bo'yicha bayroq va hudud kodi bilan.
              </p>

              <div className="p-4 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-3">
                <UzbekPlate plate={demoPlate} size="lg" />
                <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
                  <input
                    type="text"
                    value={demoPlate}
                    onChange={(e) => setDemoPlate(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 bg-white"
                    placeholder="01 A 777 AA"
                  />
                </div>
              </div>
            </div>

            {/* Sandbox 2: Status Badges */}
            <div className="sp-card p-5 bg-white space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                2. Status Belgilari (Semantik ranglar)
              </h3>
              <p className="text-xs text-slate-500">
                WCAG AA talablariga mos yashil (#16A34A), sariq (#EAB308) va qizil (#DC2626) ko'rsatkichlar.
              </p>

              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">Bo'sh holat:</span>
                  <StatusBadge status="free" spotsCount={175} size="md" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">Deyarli to'lgan:</span>
                  <StatusBadge status="warning" spotsCount={12} size="md" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">To'lgan holat:</span>
                  <StatusBadge status="full" spotsCount={2} size="md" />
                </div>
              </div>
            </div>

            {/* Sandbox 3: Buttons Matrix */}
            <div className="sp-card p-5 bg-white space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                3. Tugmalar Standarti (Button Hierarchy)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Primary CTA:</span>
                  <button className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition-colors">
                    Joy band qilish
                  </button>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Secondary / Outline:</span>
                  <button className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors">
                    Joylar rejasi
                  </button>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Destructive / Stop:</span>
                  <button className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#DC2626] hover:bg-red-700 text-white transition-colors">
                    Sessiyani to'xtatish
                  </button>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Disabled:</span>
                  <button disabled className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-200 text-slate-400 cursor-not-allowed">
                    Joy mavjud emas
                  </button>
                </div>
              </div>
            </div>

            {/* Sandbox 4: Interactive Spot Bay Preview */}
            <div className="sp-card p-5 bg-white space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                4. Avtoturargoh Joyi Kartochkasi (Bay Slot Widget)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoSpotStatus(demoSpotStatus === 'free' ? 'occupied' : 'free')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Holat: {demoSpotStatus === 'free' ? "Bo'sh" : "Band"}
                </button>
                <button
                  onClick={() => {
                    const next = demoSpotType === 'standard' ? 'ev' : demoSpotType === 'ev' ? 'disabled' : 'standard';
                    setDemoSpotType(next);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Turi: {demoSpotType.toUpperCase()}
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-center">
                <div
                  className={`w-40 p-3.5 rounded-xl border text-left flex flex-col justify-between h-28 bg-white ${
                    demoSpotStatus === 'occupied'
                      ? 'border-slate-300 opacity-70'
                      : 'border-slate-200 hover:border-[#16A34A] shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-bold font-mono text-slate-900">
                      A-07
                    </span>
                    {demoSpotType === 'ev' && (
                      <span className="p-1 rounded-md bg-blue-100 text-[#2563EB]">
                        <Zap className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {demoSpotType === 'disabled' && (
                      <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                        <Accessibility className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-auto">
                    {demoSpotStatus === 'free' ? (
                      <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                        <span>Bo'sh</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#DC2626]">
                        Band: 01 700 VAA
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Tokens Export */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dizayn Tokenlarini Eksport Qilish (Export Code)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Frontend dasturchilar va mobil ilovalar uchun CSS va JSON formatidagi tokenlar.
              </p>
            </div>
            {copiedToken && (
              <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Nusxalandi!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CSS Variables */}
            <div className="sp-card p-5 bg-white border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 font-mono">
                  tokens.css (:root)
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
`:root {
  /* Smart Parking Tashkent Design Tokens */
  --font-family: 'Inter', sans-serif;
  --color-primary: #2563EB;
  --color-free: #16A34A;
  --color-warning: #EAB308;
  --color-full: #DC2626;
  --color-bg-canvas: #FFFFFF;
  --color-text-main: #0F172A;
  --color-text-muted: #64748B;
  --radius-card: 16px;
  --shadow-soft: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
}`,
                      'CSS Tokenlar'
                    )
                  }
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  <span>Nusxalash</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`:root {
  /* Smart Parking Tashkent Design Tokens */
  --font-family: 'Inter', sans-serif;
  --color-primary: #2563EB;
  --color-free: #16A34A;
  --color-warning: #EAB308;
  --color-full: #DC2626;
  --color-bg-canvas: #FFFFFF;
  --color-text-main: #0F172A;
  --color-text-muted: #64748B;
  --radius-card: 16px;
  --shadow-soft: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
}`}
              </pre>
            </div>

            {/* JSON Tokens */}
            <div className="sp-card p-5 bg-white border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 font-mono">
                  design-tokens.json
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
JSON.stringify(
  {
    name: "Smart Parking Tashkent Design Tokens",
    colors: {
      primary: "#2563EB",
      statusFree: "#16A34A",
      statusWarning: "#EAB308",
      statusFull: "#DC2626",
      canvas: "#FFFFFF",
      textMain: "#0F172A",
      textMuted: "#64748B"
    },
    radii: {
      card: "16px",
      button: "12px",
      badge: "9999px"
    },
    typography: {
      fontFamily: "Inter, sans-serif"
    }
  },
  null,
  2
),
                      'JSON Tokenlar'
                    )
                  }
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  <span>Nusxalash</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{JSON.stringify(
  {
    name: "Smart Parking Tashkent Design Tokens",
    colors: {
      primary: "#2563EB",
      statusFree: "#16A34A",
      statusWarning: "#EAB308",
      statusFull: "#DC2626",
      canvas: "#FFFFFF",
      textMain: "#0F172A",
      textMuted: "#64748B"
    },
    radii: {
      card: "16px",
      button: "12px",
      badge: "9999px"
    },
    typography: {
      fontFamily: "Inter, sans-serif"
    }
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
