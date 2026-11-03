export interface ColorToken {
  name: string;
  variable: string;
  hex: string;
  rgb: string;
  role: string;
  description: string;
}

export const COLOR_TOKENS: ColorToken[] = [
  {
    name: 'Asosiy Ko\'k (Primary)',
    variable: '--color-primary',
    hex: '#2563EB',
    rgb: '37, 99, 235',
    role: 'Asosiy harakatlar (CTA), faol linklar, brend aksenti',
    description: 'Toshkent shahar aqlli parkovkasi brend rangi va asosiy tugmalar.',
  },
  {
    name: 'Bo\'sh / Erkin (Free)',
    variable: '--color-free',
    hex: '#16A34A',
    rgb: '22, 163, 74',
    role: 'Yetarli bo\'sh joylar mavjudligini bildiradi (>25%)',
    description: 'Haydovchilarga avtoturargohda erkin joylar borligini ko\'rsatadi.',
  },
  {
    name: 'Deyarli to\'lgan (Almost Full)',
    variable: '--color-warning',
    hex: '#EAB308',
    rgb: '234, 179, 8',
    role: 'Joylar kam qolganligi haqida ogohlantirish (5% - 25%)',
    description: 'Avtoturargoh tez to\'layotgani va shoshilish zarurligini bildiradi.',
  },
  {
    name: 'To\'lgan / Band (Full)',
    variable: '--color-full',
    hex: '#DC2626',
    rgb: '220, 38, 38',
    role: 'Bo\'sh joy yo\'qligi yoki barcha joylar bandligi (<5%)',
    description: 'Haydovchilarni boshqa yaqin avtoturargohga yo\'naltiradi.',
  },
  {
    name: 'Oq Fon (Pure Canvas)',
    variable: '--color-bg-white',
    hex: '#FFFFFF',
    rgb: '255, 255, 255',
    role: 'Asosiy ekran foni, kartalar foni va tozalik muhiti',
    description: 'Toza, zamonaviy va yorug\' minimalistik shahar uslubi.',
  },
  {
    name: 'To\'q Matn (Slate 900)',
    variable: '--color-text-main',
    hex: '#0F172A',
    rgb: '15, 23, 42',
    role: 'Asosiy sarlavhalar, raqamlar va muhim matnlar',
    description: 'WCAG AAA kontrastiga ega yuqori o\'qiluvchanlik.',
  },
  {
    name: 'Yordamchi Kulrang (Slate 500)',
    variable: '--color-text-muted',
    hex: '#64748B',
    rgb: '100, 116, 139',
    role: 'Izohlar, metama\'lumotlar, manzil va vaqtlar',
    description: 'Ko\'zni charchatmaydigan yordamchi matn darajasi.',
  },
  {
    name: 'Silliq Chiziq (Slate 200)',
    variable: '--color-border',
    hex: '#E2E8F0',
    rgb: '226, 232, 240',
    role: 'Kartalar va bo\'limlar orasidagi nozik ajratgichlar',
    description: 'Yumshoq 1px hairline konturlari.',
  },
];

export const TYPOGRAPHY_TOKENS = [
  {
    level: 'Display Katta',
    size: '32px (2rem)',
    weight: 'Bold 700',
    lineHeight: '1.25',
    sample: 'Aqlli Parkovka: Toshkent',
    usage: 'Bosh sahifa asosiy sarlavhalari',
  },
  {
    level: 'Sarlavha 1 (H1)',
    size: '24px (1.5rem)',
    weight: 'SemiBold 600',
    lineHeight: '1.3',
    sample: 'Toshkent City Park & Mall',
    usage: 'Avtoturargoh nomlari, modal sarlavhalari',
  },
  {
    level: 'Sarlavha 2 (H2)',
    size: '18px (1.125rem)',
    weight: 'SemiBold 600',
    lineHeight: '1.4',
    sample: 'Bo\'sh joylar va tariflar',
    usage: 'Karta ichidagi kichik sarlavhalar',
  },
  {
    level: 'Tana matni (Body)',
    size: '15px (0.9375rem)',
    weight: 'Regular 400 / Medium 500',
    lineHeight: '1.5',
    sample: 'Botir Zokirov ko\'chasi, 7 · Shayxontohur tumani',
    usage: 'Manzillar, tavsiflar va interfeys matnlari',
  },
  {
    level: 'Kichik izoh (Caption)',
    size: '13px (0.8125rem)',
    weight: 'Medium 500',
    lineHeight: '1.4',
    sample: '24/7 rejim · Kamera nazorati',
    usage: 'Status belgilari, pastki yordamchi ma\'lumotlar',
  },
  {
    level: 'Tabulyar raqamlar (Tabular Nums)',
    size: '18px / 24px',
    weight: 'Bold 700 font-mono tabular-nums',
    lineHeight: '1.2',
    sample: '8 000 so\'m/soat · 175 ta joy',
    usage: 'Narxlar, daqiqalar va hisoblagichlar vertikal tekislanishi',
  },
];

export const ELEVATION_TOKENS = [
  {
    name: 'Karta radiusi (Card Radius)',
    value: '16px (rounded-2xl)',
    css: 'border-radius: 16px',
    description: 'Barcha kartalar, modallar va asosiy konteynerlar uchun yagona 16px radiusi.',
  },
  {
    name: 'Yumshoq soya (Soft Ambient Shadow)',
    value: 'shadow-soft',
    css: 'box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 1px 3px 0 rgba(15, 23, 42, 0.03)',
    description: 'Ko\'zni qamashtirmaydigan tabiiy kunduzgi yengil soya.',
  },
  {
    name: 'Kengaytirilgan suzuvchi soya (Hover / Modal Shadow)',
    value: 'shadow-soft-lg',
    css: 'box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
    description: 'Modal oynalar, suzuvchi panellar va hover qilingan kartalar uchun.',
  },
];
