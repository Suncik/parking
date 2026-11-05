export type UserRole = 'driver' | 'owner' | 'admin';
export type MainView = 'admin' | 'dashboard' | 'mobile' | 'design-system';

export interface AuthSession {
  login: string;
  role: UserRole; // hozir faol rol
  roles: UserRole[]; // foydalanuvchida mavjud barcha rollar
  displayName: string;
}

export const ROLE_LABEL: Record<UserRole, string> = {
  driver: 'Haydovchi',
  owner: 'Parking egasi',
  admin: 'Admin',
};

// Har bir rol qaysi oynalarni ko'ra oladi
export const ROLE_VIEWS: Record<UserRole, MainView[]> = {
  driver: ['mobile'],
  owner: ['dashboard'],
  admin: ['admin', 'dashboard', 'mobile', 'design-system'],
};

export const ROLE_DEFAULT_VIEW: Record<UserRole, MainView> = {
  driver: 'mobile',
  owner: 'dashboard',
  admin: 'admin',
};

// ───────────────────────────────────────────────────────────────
// DEMO autentifikatsiya. Bu faqat brauzerda ishlaydi, shuning uchun HAQIQIY himoya emas:
// kod brauzerga yuklanadi va uni chetlab o'tish mumkin. Ishlab chiqarishda
// `authenticate`, `registerUser` va rol tekshiruvini backend API (token) bilan almashtiring.
// Parollar SHA-256 xesh ko'rinishida ("login:parol" dan).
// ───────────────────────────────────────────────────────────────
interface Account {
  login: string;
  displayName: string;
  roles: UserRole[];
  hash: string;
}

const DEMO_ACCOUNTS: Account[] = [
  {
    login: 'haydovchi',
    displayName: 'Haydovchi',
    roles: ['driver'],
    hash: '84f0ef06d7190c612c577bd1a05f28416386dbcfc85271530a93dd8a773e23a2',
  },
  {
    // Egasi ham haydovchi bo'la oladi (bitta akkaunt, ikki rol)
    login: 'operator',
    displayName: 'Parking egasi',
    roles: ['owner', 'driver'],
    hash: 'ede70955a02be8b38df1368b6b1e4eb35a7e58ca361618a62ca1d1ee9ade8dc3',
  },
  {
    login: 'admin',
    displayName: 'Administrator',
    roles: ['admin'],
    hash: '7aa652db613dbca3130ddf5dd659d3ca93011c9b1b00971aed904149c01cc4cb',
  },
];

const USERS_KEY = 'smart-parking-users';
const EXTRA_ROLES_KEY = 'smart-parking-extra-roles';
const SESSION_KEY = 'smart-parking-session';

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const getRegisteredUsers = () => readJson<Account[]>(USERS_KEY, []);

/** Telefon raqamni "998901234567" ko'rinishiga keltiradi. Noto'g'ri bo'lsa null. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 9) return `998${digits}`;
  if (digits.length === 12 && digits.startsWith('998')) return digits;
  return null;
}

export function formatPhone(login: string): string {
  if (/^998\d{9}$/.test(login)) {
    return `+998 ${login.slice(3, 5)} ${login.slice(5, 8)} ${login.slice(8, 10)} ${login.slice(10, 12)}`;
  }
  return login;
}

function findAccount(login: string): Account | undefined {
  return [...DEMO_ACCOUNTS, ...getRegisteredUsers()].find((a) => a.login === login);
}

/** Akkauntning barcha rollari: asosiy + keyin qo'shilganlar. */
export function getRoles(login: string): UserRole[] {
  const base = findAccount(login)?.roles ?? [];
  const extra = readJson<Record<string, UserRole[]>>(EXTRA_ROLES_KEY, {})[login] ?? [];
  return Array.from(new Set([...base, ...extra]));
}

/** Mavjud akkauntga yangi rol qo'shadi (masalan, haydovchi -> parking egasi). Admin qo'shib bo'lmaydi. */
export function addRole(login: string, role: Exclude<UserRole, 'admin'>) {
  const all = readJson<Record<string, UserRole[]>>(EXTRA_ROLES_KEY, {});
  all[login] = Array.from(new Set([...(all[login] ?? []), role]));
  writeJson(EXTRA_ROLES_KEY, all);
}

function buildSession(acc: Account, role?: UserRole): AuthSession {
  const roles = getRoles(acc.login);
  const active = role && roles.includes(role) ? role : roles[0];
  return { login: acc.login, role: active, roles, displayName: acc.displayName };
}

/** Muvaffaqiyatli bo'lsa sessiya, aks holda null qaytaradi. */
export async function authenticate(loginInput: string, password: string): Promise<AuthSession | null> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Xavfsiz ulanish (HTTPS yoki localhost) talab qilinadi');
  }
  const raw = loginInput.trim().toLowerCase();
  const login = normalizePhone(raw) ?? raw; // telefon yoki demo login
  const acc = findAccount(login);
  if (!acc) return null;
  const hash = await sha256Hex(`${login}:${password}`);
  return acc.hash === hash ? buildSession(acc) : null;
}

export type RegisterResult = { ok: true; session: AuthSession } | { ok: false; error: string };

/** Yangi foydalanuvchini ro'yxatdan o'tkazadi (haydovchi yoki parking egasi). */
export async function registerUser(input: {
  name: string;
  phone: string;
  password: string;
  role: Exclude<UserRole, 'admin'>;
}): Promise<RegisterResult> {
  if (!globalThis.crypto?.subtle) {
    return { ok: false, error: 'Xavfsiz ulanish (HTTPS yoki localhost) talab qilinadi' };
  }
  const login = normalizePhone(input.phone);
  if (!login) return { ok: false, error: "Telefon raqamni to'g'ri kiriting (90 123 45 67)" };
  if (findAccount(login)) return { ok: false, error: "Bu raqam ro'yxatdan o'tgan. Kirish bo'limidan foydalaning" };
  const acc: Account = {
    login,
    displayName: input.name.trim(),
    roles: [input.role],
    hash: await sha256Hex(`${login}:${input.password}`),
  };
  writeJson(USERS_KEY, [...getRegisteredUsers(), acc]);
  return { ok: true, session: buildSession(acc) };
}

/** Faol rolni almashtiradi (faqat foydalanuvchida bor rolga). */
export function switchRole(session: AuthSession, role: UserRole): AuthSession {
  const acc = findAccount(session.login);
  if (!acc) return session;
  const next = buildSession(acc, role);
  saveSession(next);
  return next;
}

/** Rollar ro'yxati yangilangach (masalan, yangi rol qo'shilgach) sessiyani yangilaydi. */
export function refreshSession(session: AuthSession, role?: UserRole): AuthSession {
  const acc = findAccount(session.login);
  if (!acc) return session;
  const next = buildSession(acc, role ?? session.role);
  saveSession(next);
  return next;
}

export function loadSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as AuthSession;
    const acc = s ? findAccount(s.login) : undefined;
    if (!acc) return null;
    return buildSession(acc, s.role);
  } catch {
    return null;
  }
}

export function saveSession(s: AuthSession | null) {
  try {
    if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* sessionStorage mavjud emas */
  }
}
