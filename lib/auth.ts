import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

const SESSION_COOKIE = 'rmc_admin_session';
const SECRET = process.env.SESSION_SECRET || 'fallback-secret-change-in-production';

// Sign a value with HMAC so it can't be forged
function sign(value: string): string {
  const hmac = createHmac('sha256', SECRET);
  hmac.update(value);
  return `${value}.${hmac.digest('hex')}`;
}

function verify(signed: string): string | null {
  const lastDot = signed.lastIndexOf('.');
  if (lastDot === -1) return null;
  const value = signed.slice(0, lastDot);
  const expected = sign(value);
  // Constant-time comparison to prevent timing attacks
  if (signed.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < signed.length; i++) {
    diff |= signed.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0 ? value : null;
}

export async function setAdminSession() {
  const payload = `admin:${Date.now()}`;
  const signed = sign(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return false;
  const value = verify(cookie.value);
  if (!value) return false;
  // Check session not older than 8 hours
  const parts = value.split(':');
  if (parts.length !== 2) return false;
  const ts = parseInt(parts[1]);
  return Date.now() - ts < 8 * 60 * 60 * 1000;
}

// Use in API routes (works with Request object)
export function getSessionFromRequest(req: Request): boolean {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return false;
  const value = verify(decodeURIComponent(match[1]));
  if (!value) return false;
  const parts = value.split(':');
  if (parts.length !== 2) return false;
  const ts = parseInt(parts[1]);
  return Date.now() - ts < 8 * 60 * 60 * 1000;
}
