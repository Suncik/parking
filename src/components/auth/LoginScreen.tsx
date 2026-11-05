import React, { useState } from 'react';
import { Lock, User, LogIn, Loader2, AlertCircle, Car, Building2, ArrowLeft, Phone, ShieldCheck } from 'lucide-react';
import { AuthSession, authenticate, registerUser } from '../../data/auth';
import { OwnerOnboarding } from './OwnerOnboarding';

interface LoginScreenProps {
  onLogin: (session: AuthSession) => void;
}

type Mode = 'login' | 'register';
type RegStep = 'role' | 'form' | 'sms' | 'onboarding';
type RegRole = 'driver' | 'owner';

const DEMO_SMS_CODE = '123456';

const inputCls =
  'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 bg-white';

const ErrorBox: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
    <AlertCircle className="w-4 h-4 shrink-0" />
    <span>{text}</span>
  </div>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Kirish
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // Ro'yxatdan o'tish
  const [step, setStep] = useState<RegStep>('role');
  const [role, setRole] = useState<RegRole>('driver');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [pendingSession, setPendingSession] = useState<AuthSession | null>(null);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setStep('role');
  };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim() || !password) {
      setError('Login (telefon) va parolni kiriting');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const session = await authenticate(login, password);
      if (session) onLogin(session);
      else {
        setError("Login yoki parol noto'g'ri");
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError('Ismingizni kiriting');
    if (phone.replace(/\D/g, '').length !== 9) return setError("Telefon raqamni kiriting (9 ta raqam: 90 123 45 67)");
    if (pass1.length < 6) return setError("Parol kamida 6 belgidan iborat bo'lsin");
    if (pass1 !== pass2) return setError('Parollar bir xil emas');
    setError(null);
    setSmsCode('');
    setStep('sms');
  };

  const submitSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (smsCode !== DEMO_SMS_CODE) return setError("SMS kod noto'g'ri");
    setLoading(true);
    setError(null);
    const res = await registerUser({ name, phone, password: pass1, role });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      setStep('form');
      return;
    }
    if (role === 'owner') {
      setPendingSession(res.session);
      setStep('onboarding');
    } else {
      onLogin(res.session);
    }
  };

  const wide = mode === 'register' && step === 'onboarding';

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div
        className={`w-full ${wide ? 'max-w-lg' : 'max-w-sm'} bg-white rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto`}
      >
        {wide && pendingSession ? (
          <OwnerOnboarding
            ownerLogin={pendingSession.login}
            ownerName={pendingSession.displayName}
            onDone={() => onLogin(pendingSession)}
          />
        ) : (
          <div className="p-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-extrabold text-lg">
                P
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900 leading-tight">Smart Parking Toshkent</h1>
                <p className="text-xs text-slate-500">
                  {mode === 'login' ? 'Tizimga kirish' : "Ro'yxatdan o'tish"}
                </p>
              </div>
            </div>

            {/* Kirish / Ro'yxatdan o'tish */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              {(
                [
                  ['login', 'Kirish'],
                  ['register', "Ro'yxatdan o'tish"],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    mode === m ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === 'login' && (
              <form onSubmit={submitLogin} className="space-y-4" autoComplete="on">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Telefon raqam yoki login</span>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      autoComplete="username"
                      autoFocus
                      className="w-full py-2.5 text-sm text-slate-900 focus:outline-none bg-transparent"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Parol</span>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full py-2.5 text-sm text-slate-900 focus:outline-none bg-transparent"
                      placeholder="Parolingiz"
                    />
                  </div>
                </label>

                {error && <ErrorBox text={error} />}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-sm rounded-xl py-3 transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  Kirish
                </button>
              </form>
            )}

            {mode === 'register' && step === 'role' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">Siz kimsiz? Keyinroq ikkinchi rolni ham qo'shish mumkin.</p>
                {(
                  [
                    ['driver', 'Haydovchi', "Parking qidiraman va joy band qilaman", Car],
                    ['owner', 'Parking egasi', 'Savdo markazi, universitet yoki turar-joy parkingim bor', Building2],
                  ] as const
                ).map(([r, title, desc, Icon]) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setError(null);
                      setStep('form');
                    }}
                    className="w-full text-left flex items-start gap-3 rounded-2xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/40 p-4 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-slate-900 block">{title}</span>
                      <span className="text-xs text-slate-500">{desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {mode === 'register' && step === 'form' && (
              <form onSubmit={submitForm} className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep('role');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {role === 'driver' ? 'Haydovchi' : 'Parking egasi'}
                </button>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Ism familiya</span>
                  <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Telefon raqam</span>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-500">+998</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ''))}
                      inputMode="tel"
                      autoComplete="tel-national"
                      className="w-full py-2.5 text-sm text-slate-900 focus:outline-none bg-transparent"
                      placeholder="90 123 45 67"
                    />
                  </div>
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Parol</span>
                  <input type="password" className={inputCls} value={pass1} onChange={(e) => setPass1(e.target.value)} autoComplete="new-password" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Parolni takrorlang</span>
                  <input type="password" className={inputCls} value={pass2} onChange={(e) => setPass2(e.target.value)} autoComplete="new-password" />
                </label>
                {error && <ErrorBox text={error} />}
                <button
                  type="submit"
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-xl py-3 transition-colors"
                >
                  Davom etish
                </button>
              </form>
            )}

            {mode === 'register' && step === 'sms' && (
              <form onSubmit={submitSms} className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep('form');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Orqaga
                </button>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" /> SMS kodni kiriting
                </div>
                <p className="text-xs text-slate-500">
                  +998 {phone} raqamiga kod yuborildi. <b>Demo rejim:</b> kod {DEMO_SMS_CODE}.
                </p>
                <input
                  className={`${inputCls} tracking-[0.4em] text-center font-mono text-lg`}
                  value={smsCode}
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                />
                {error && <ErrorBox text={error} />}
                <button
                  type="submit"
                  disabled={loading || smsCode.length < 6}
                  className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-sm rounded-xl py-3 transition-colors"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Tasdiqlash
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
