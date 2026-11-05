import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { TASHKENT_PARKING_ZONES, STATUS_CONFIG, buildOwnerZone } from './data/parkingData';
import { INITIAL_SAVED_CARDS } from './data/savedCards';
import { ParkingZone, ParkingSpot, ActiveSession, MainTabType, ParkingStatus, SavedCard, UserLocation, LocationSource } from './types';
import { Place, nearestDistrict } from './data/places';
import { TASHKENT_CENTER, haversineMeters, formatDistance, isInsideTashkent } from './utils/geo';
import { MobileTopSearchBar } from './components/mobile/MobileTopSearchBar';
import { MobileMapLegend } from './components/mobile/MobileMapLegend';
import { MobileBottomSheetCard } from './components/mobile/MobileBottomSheetCard';
import { MobileOSMMap } from './components/mobile/MobileOSMMap';
import { MobileBottomTabBar } from './components/mobile/MobileBottomTabBar';
import { MobileBookingTab } from './components/mobile/MobileBookingTab';
import { ReservationScreen } from './components/mobile/ReservationScreen';
import { MobileHistoryTab } from './components/mobile/MobileHistoryTab';
import { MobileProfileTab } from './components/mobile/MobileProfileTab';
import { BookingModal } from './components/app/BookingModal';
import { SpotSelectorModal } from './components/app/SpotSelectorModal';
import { ReceiptModal } from './components/app/ReceiptModal';
import { DesignSystemView } from './components/design-system/DesignSystemView';
import { OperatorDashboard } from './components/desktop/OperatorDashboard';
import { AdminDashboard } from './components/desktop/AdminDashboard';
import { LoginScreen } from './components/auth/LoginScreen';
import { AuthSession, MainView, UserRole, ROLE_LABEL, ROLE_VIEWS, ROLE_DEFAULT_VIEW, loadSession, saveSession, switchRole, addRole, refreshSession } from './data/auth';
import { useApplications } from './utils/applicationsStore';
import { Smartphone, Monitor, Palette, CheckCircle2, ArrowLeft, LayoutDashboard, Shield, LogOut } from 'lucide-react';

export default function App() {
  // Namunaviy parkinglar + faollashtirilgan (sensorlari o'rnatilgan) egalar parkinglari
  const [baseZones] = useState<ParkingZone[]>(TASHKENT_PARKING_ZONES);
  const applications = useApplications();
  const allZones = useMemo<ParkingZone[]>(
    () => [
      ...baseZones,
      ...applications.filter((a) => a.status === 'active').map((a, i) => buildOwnerZone(a, i)),
    ],
    [baseZones, applications]
  );

  // Foydalanuvchining joriy joylashuvi (GPS -> xaritadan tanlash -> qidiruv)
  const [userLoc, setUserLoc] = useState<UserLocation>({
    lat: TASHKENT_CENTER.lat,
    lng: TASHKENT_CENTER.lng,
    source: 'loading',
    label: 'Aniqlanmoqda…',
  });
  const [isPickingLocation, setIsPickingLocation] = useState(false);

  // Barcha parkinglar: masofa foydalanuvchi joylashuvidan (havo chizig'ida) hisoblanadi
  const zones = useMemo<ParkingZone[]>(
    () =>
      allZones.map((z) => {
        const meters = haversineMeters(userLoc, z);
        return { ...z, distanceMeters: Math.round(meters), distance: formatDistance(meters) };
      }),
    [allZones, userLoc.lat, userLoc.lng]
  );

  // Tanlangan parking (id bo'yicha saqlanadi, masofa doim yangi bo'ladi)
  const [selectedZoneId, setSelectedZoneId] = useState<string>(TASHKENT_PARKING_ZONES[0].id);
  const selectedZone: ParkingZone = zones.find((z) => z.id === selectedZoneId) ?? zones[0];
  
  // Main View Mode: 'admin' (Smart Parking Admin), 'dashboard' (Central Parking Operator), 'mobile', 'design-system'
  // Kirgan foydalanuvchi (rol) — har bir rol faqat o'ziga ruxsat etilgan oynalarni ko'radi
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());
  const [currentMainView, setCurrentMainViewRaw] = useState<MainView>(() => {
    const s = loadSession();
    return s ? ROLE_DEFAULT_VIEW[s.role] : 'admin';
  });
  const allowedViews: MainView[] = session ? ROLE_VIEWS[session.role] : [];
  // Ruxsat etilmagan oynaga o'tishga urinish e'tiborga olinmaydi
  const setCurrentMainView = (v: MainView) => {
    if (allowedViews.includes(v)) setCurrentMainViewRaw(v);
  };
  const handleLogin = (s: AuthSession) => {
    saveSession(s);
    setSession(s);
    setCurrentMainViewRaw(ROLE_DEFAULT_VIEW[s.role]);
  };
  // Bitta akkaunt, bir nechta rol: faol rolni almashtirish
  const handleSwitchRole = (role: UserRole) => {
    if (!session) return;
    const next = switchRole(session, role);
    setSession(next);
    setCurrentMainViewRaw(ROLE_DEFAULT_VIEW[next.role]);
  };
  // Haydovchi parking egasi roliga ega bo'ladi (arizani keyin dashboardda to'ldiradi)
  const handleBecomeOwner = () => {
    if (!session) return;
    addRole(session.login, 'owner');
    const next = refreshSession(session, 'owner');
    setSession(next);
    setCurrentMainViewRaw(ROLE_DEFAULT_VIEW.owner);
  };
  const handleLogout = () => {
    saveSession(null);
    setSession(null);
    setActiveTab('map');
  };

  // 4 Main Mobile Tabs: Xarita, Band qilish, Tarix, Profil
  const [activeTab, setActiveTab] = useState<MainTabType>('map');
  
  // Desktop view mode toggle for mobile app (Phone Frame vs Edge-to-edge)
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ParkingStatus>('all');
  const [mapCenterTrigger, setMapCenterTrigger] = useState(0);

  // Navigation route state
  const [isNavigating, setIsNavigating] = useState(false);

  // Modals
  const [bookingZone, setBookingZone] = useState<ParkingZone | null>(null);
  const [inspectZone, setInspectZone] = useState<ParkingZone | null>(null);
  const [receiptSession, setReceiptSession] = useState<ActiveSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved Payment Cards (Shared between Profil and Rezervatsiya)
  const [savedCards, setSavedCards] = useState<SavedCard[]>(INITIAL_SAVED_CARDS);

  // Active Session state
  const [activeSession, setActiveSession] = useState<ActiveSession | null>({
    id: 'sess-01',
    zoneId: 'parking-1',
    zoneName: 'Parking #1 (Amir Temur)',
    spotCode: 'A-14',
    vehiclePlate: '01 A 777 AA',
    startTime: Date.now() - 15 * 60 * 1000,
    durationMinutes: 120,
    hourlyRate: 5000,
    paymentMethod: 'payme',
    totalPaid: 10000,
    status: 'active',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Foydalanuvchiga eng yaqin (imkon bo'lsa bo'sh joyi bor) parkingni topish
  const nearestZoneId = (p: { lat: number; lng: number }) => {
    const withFree = allZones.filter((z) => z.occupiedSpots < z.totalSpots);
    const pool = withFree.length > 0 ? withFree : allZones;
    return pool.reduce((best, z) => (haversineMeters(p, z) < haversineMeters(p, best) ? z : best), pool[0]).id;
  };

  const applyLocation = (lat: number, lng: number, source: LocationSource, label: string, selectNearest = true) => {
    setUserLoc({ lat, lng, source, label });
    if (selectNearest) setSelectedZoneId(nearestZoneId({ lat, lng }));
    setIsNavigating(false);
  };

  const applyDefaultLocation = (label: string) =>
    applyLocation(TASHKENT_CENTER.lat, TASHKENT_CENTER.lng, 'default', label);

  // 1) GPS orqali joylashuvni aniqlash
  const locateByGps = useCallback((announce: boolean) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      applyDefaultLocation('Toshkent markazi (taxminiy)');
      showToast("Brauzer GPS'ni qo'llamaydi. Joyni xaritadan yoki qidiruvdan tanlang");
      return;
    }
    setUserLoc((prev) => ({ ...prev, source: 'loading', label: 'Aniqlanmoqda…' }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!isInsideTashkent(p)) {
          applyDefaultLocation('Toshkent markazi (GPS Toshkentdan tashqarida)');
          showToast('GPS joylashuvingiz Toshkentdan tashqarida. Joyni xaritadan yoki qidiruvdan tanlang');
          return;
        }
        applyLocation(p.lat, p.lng, 'gps', `${nearestDistrict(p).name} yaqinida`);
        setMapCenterTrigger(Date.now());
        if (announce) showToast('Joylashuvingiz aniqlandi');
      },
      (err) => {
        applyDefaultLocation('Toshkent markazi (taxminiy)');
        showToast(
          err.code === 1
            ? "GPS ruxsati berilmadi. Joyni xaritadan yoki qidiruvdan tanlang"
            : "Joylashuvni aniqlab bo'lmadi. Joyni xaritadan yoki qidiruvdan tanlang"
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allZones]);

  // Ilova ochilganda joylashuvni avtomatik aniqlash
  useEffect(() => {
    if (session) locateByGps(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.login]);

  // 2) Xaritadan tanlash (xaritaga bosish yoki markerni sudrab olib borish)
  const handlePickLocation = (lat: number, lng: number) => {
    applyLocation(lat, lng, 'manual', `Xaritadan tanlangan joy (${nearestDistrict({ lat, lng }).name})`);
    setIsPickingLocation(false);
    showToast('Joylashuvingiz yangilandi');
  };

  // 3) Qidiruv orqali (tuman yoki mashhur joy) joylashuvni belgilash
  const handleSelectPlace = (place: Place) => {
    applyLocation(place.lat, place.lng, 'manual', place.name);
    setMapCenterTrigger(Date.now());
    showToast(`Joylashuv: ${place.name}`);
  };

  // Qidiruvdan parking tanlash (barcha tumanlar bo'yicha)
  const handleSelectZoneFromSearch = (zone: ParkingZone) => {
    setSelectedZoneId(zone.id);
    setIsNavigating(false);
    showToast(`Tanlandi: ${zone.displayName} · ${zone.name}`);
  };

  // Handle Navigation Trigger
  const handleNavigate = (zone: ParkingZone) => {
    setIsNavigating(true);
    setActiveTab('map');
    showToast(`Yo'nalish boshlandi: ${zone.displayName} (${zone.distance})`);
  };

  // Handle Booking Confirmation
  const handleBookingSuccess = (newSession: ActiveSession) => {
    setActiveSession(newSession);
    setBookingZone(null);
    showToast(`Joy muvaffaqiyatli band qilindi: ${newSession.spotCode}`);
    setActiveTab('history');
  };

  const handleAddCard = (newCard: SavedCard) => {
    setSavedCards((prev) => {
      if (newCard.isPrimary) {
        return [newCard, ...prev.map((c) => ({ ...c, isPrimary: false }))];
      }
      return [...prev, newCard];
    });
    showToast(`Yangi karta qo'shildi: •••• ${newCard.last4}`);
  };

  const handleSetPrimaryCard = (cardId: string) => {
    setSavedCards((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === cardId,
      }))
    );
    showToast("Asosiy to'lov kartasi yangilandi");
  };

  // Render the Mobile Screen
  const renderMobileScreen = () => (
    <div className="relative w-full h-full flex flex-col bg-white overflow-hidden font-sans select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: XARITA (Full Screen Map View with Search, Legend, and Bottom Sheet Card) */}
      {activeTab === 'map' && (
        <div className="relative w-full h-full flex-1 overflow-hidden">
          {/* Top Search Bar (Floating over map) */}
          <div className="absolute top-3 left-4 right-4 z-30">
            <MobileTopSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              zones={zones}
              userLocation={userLoc}
              onSelectZone={handleSelectZoneFromSearch}
              onSelectPlace={handleSelectPlace}
              onCurrentLocationClick={() => locateByGps(true)}
              onPickOnMap={() => setIsPickingLocation(true)}
              isPickingLocation={isPickingLocation}
            />
          </div>

          {/* Full-Screen OpenStreetMap Style Map */}
          <MobileOSMMap
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={(z) => {
              setSelectedZoneId(z.id);
              setIsNavigating(false);
            }}
            isNavigating={isNavigating}
            filterStatus={statusFilter}
            mapCenterTrigger={mapCenterTrigger}
            userLocation={userLoc}
            isPickingLocation={isPickingLocation}
            onPickLocation={handlePickLocation}
            onCancelPick={() => setIsPickingLocation(false)}
          />

          {/* Floating Map Legend (🟢 Bo'sh parking, 🟡 Deyarli to'la, 🔴 Bo'sh joy yo'q) */}
          <div className="absolute bottom-[230px] sm:bottom-[215px] left-4 right-4 z-20 flex justify-center pointer-events-auto">
            <MobileMapLegend
              activeFilter={statusFilter}
              onFilterToggle={(flt) => {
                setStatusFilter((prev) => (prev === flt ? 'all' : flt));
              }}
            />
          </div>

          {/* Bottom Sheet Card: "Parking #1 — 1.2 km", "Bo'sh joy: 14 / 50", "Narx: 5 000 so'm/soat" */}
          <div className="absolute bottom-16 left-3 right-3 sm:left-4 sm:right-4 z-30 pointer-events-auto">
            <MobileBottomSheetCard
              zone={selectedZone}
              onNavigate={handleNavigate}
              onBook={() => {
                setActiveTab('booking');
              }}
              isNavigating={isNavigating}
              onCancelNavigation={() => {
                setIsNavigating(false);
                showToast("Yo'nalish to'xtatildi");
              }}
            />
          </div>
        </div>
      )}

      {/* Tab 2: BAND QILISH / REZERVATSIYA (Mobile Screen with Payment Flow & Two States) */}
      {activeTab === 'booking' && (
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <ReservationScreen
            savedCards={savedCards}
            onAddCard={handleAddCard}
            onBackToMap={() => setActiveTab('map')}
          />
        </div>
      )}

      {/* Tab 3: TARIX (History & Active Receipts) */}
      {activeTab === 'history' && (
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <MobileHistoryTab
            activeSession={activeSession}
            onViewReceipt={(sess) => setReceiptSession(sess)}
            onGoToMap={() => setActiveTab('map')}
          />
        </div>
      )}

      {/* Tab 4: PROFIL (User & Saved Cards with Uzcard/Humo badge and + Karta qo'shish) */}
      {activeTab === 'profile' && (
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <MobileProfileTab
            savedCards={savedCards}
            onAddCard={handleAddCard}
            onSetPrimaryCard={handleSetPrimaryCard}
            onOpenDesignSystem={() => setCurrentMainView('design-system')}
          />
        </div>
      )}

      {/* Bottom Tab Bar (Fixed: Xarita, Band qilish, Tarix, Profil) */}
      <MobileBottomTabBar
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        hasActiveSession={!!activeSession}
      />
    </div>
  );

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Joriy oyna ruxsat etilmagan bo'lsa (masalan sessiya o'zgargan), rolning asosiy oynasiga qaytariladi
  const activeView: MainView = allowedViews.includes(currentMainView)
    ? currentMainView
    : ROLE_DEFAULT_VIEW[session.role];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 font-sans flex flex-col justify-between">
      {/* Top Application Mode Switcher Bar */}
      <div className="bg-slate-950 border-b border-slate-800 text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-50 select-none">
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
            P
          </div>
          <span className="font-extrabold tracking-tight text-white text-sm">
            Smart Parking Tashkent
          </span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">Shahar avtoturargohlari ekotizimi</span>
        </div>

        {/* 4 Main View Tabs: Admin Dashboard, Operator Dashboard, Mobile App, Design System */}
        <div className={`${allowedViews.length > 1 ? "flex" : "hidden"} items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto`}>
          {allowedViews.includes('admin') && allowedViews.length > 1 && (
            <button
              onClick={() => setCurrentMainView('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeView === 'admin'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Smart Parking Admin</span>
            </button>
          )}

          {allowedViews.includes('dashboard') && allowedViews.length > 1 && (
            <button
              onClick={() => setCurrentMainView('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeView === 'dashboard'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Central Parking (Dispetcher)</span>
            </button>
          )}

          {allowedViews.includes('mobile') && allowedViews.length > 1 && (
            <button
              onClick={() => setCurrentMainView('mobile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeView === 'mobile'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobil Ilova (Haydovchi)</span>
            </button>
          )}

          {allowedViews.includes('design-system') && allowedViews.length > 1 && (
            <button
              onClick={() => setCurrentMainView('design-system')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeView === 'design-system'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Dizayn Tizimi</span>
            </button>
          )}
        </div>

        {/* Contextual actions */}
        <div className="flex items-center gap-2">
          {activeView === 'mobile' && (
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Telefon ramkasi / Keng ko'rinish"
            >
              {isPhoneFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Keng Ko'rinish</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Telefon Ramkasi</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span>Toshkent · Jonli</span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            {session.roles.filter((r) => r !== 'admin').length > 1 && (
              <div className="flex p-0.5 bg-slate-800 rounded-lg">
                {session.roles
                  .filter((r) => r !== 'admin')
                  .map((r) => (
                    <button
                      key={r}
                      onClick={() => handleSwitchRole(r)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                        session.role === r ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {ROLE_LABEL[r]}
                    </button>
                  ))}
              </div>
            )}
            {session.role === 'driver' && !session.roles.includes('owner') && (
              <button
                onClick={handleBecomeOwner}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition-colors"
              >
                Parking egasi bo'lish
              </button>
            )}
            <div className="text-right leading-tight hidden sm:block">
              <div className="text-[11px] font-bold text-white">{session.displayName}</div>
              <div className="text-[10px] text-slate-400">{ROLE_LABEL[session.role]}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Content Area */}
      {activeView === 'admin' ? (
        /* View 0: Desktop Admin Dashboard "Smart Parking Admin" */
        <div className="flex-1 w-full bg-[#F8FAFC]">
          <AdminDashboard
            onSwitchToOperator={() => setCurrentMainView('dashboard')}
            onSwitchToMobile={() => setCurrentMainView('mobile')}
            onOpenDesignSystem={() => setCurrentMainView('design-system')}
          />
        </div>
      ) : activeView === 'dashboard' ? (
        /* View 1: Desktop Operator Dashboard for "Central Parking" */
        <div className="flex-1 w-full bg-[#F8FAFC]">
          <OperatorDashboard
            onSwitchToMobileApp={() => setCurrentMainView('mobile')}
            onOpenDesignSystem={() => setCurrentMainView('design-system')}
          />
        </div>
      ) : activeView === 'design-system' ? (
        /* View 2: Full Design System Documentation & Workbench */
        <div className="flex-1 w-full bg-[#F8FAFC] p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMainView('dashboard')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Operator paneliga qaytish</span>
              </button>
            </div>
            <DesignSystemView />
          </div>
        </div>
      ) : (
        /* View 3: Mobile Driver Application (OSM Map & Rezervatsiya Screen) */
        <div className="flex-1 flex items-center justify-center p-0 sm:p-4 overflow-hidden bg-slate-900">
          {isPhoneFrame ? (
            /* Realistic Smartphone Device Frame (iPhone 16 Pro mockup) */
            <div className="w-[390px] h-[844px] bg-white rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-[11px] border-slate-800 overflow-hidden relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Dynamic Island / Notch */}
              <div className="h-10 bg-white shrink-0 flex items-center justify-between px-7 pt-2 select-none z-40 border-b border-slate-100/40">
                <span className="text-[12px] font-bold font-mono text-slate-900">
                  09:41
                </span>
                <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto" />
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Mobile Viewport */}
              <div className="flex-1 relative overflow-hidden bg-white">
                {renderMobileScreen()}
              </div>
            </div>
          ) : (
            /* Responsive Edge-to-Edge Mobile Screen */
            <div className="w-full max-w-md h-[100dvh] sm:h-[844px] bg-white sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col border sm:border-slate-800">
              {renderMobileScreen()}
            </div>
          )}
        </div>
      )}

      {/* Modals & Dialogs */}
      {bookingZone && (
        <BookingModal
          zone={bookingZone}
          spot={null}
          onClose={() => setBookingZone(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {inspectZone && (
        <SpotSelectorModal
          zone={inspectZone}
          onClose={() => setInspectZone(null)}
          onConfirmSpot={(zone, spot) => {
            setInspectZone(null);
            setBookingZone(zone);
          }}
        />
      )}

      {receiptSession && (
        <ReceiptModal
          session={receiptSession}
          onClose={() => setReceiptSession(null)}
        />
      )}
    </div>
  );
}
