import crypto from 'crypto';

export interface MagicLinkPayload {
  sessionId: string;
  orderId?: string;
  email: string;
  exp: number; // unix epoch seconds
}

function getSecret(): string {
  return process.env.MAGIC_LINK_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
}

function base64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function hmac(data: string, secret: string): string {
  return base64url(crypto.createHmac('sha256', secret).update(data).digest());
}

export function createMagicToken(payload: Omit<MagicLinkPayload, 'exp'> & { ttlSeconds?: number }): string {
  const secret = getSecret();
  const exp = Math.floor(Date.now() / 1000) + (payload.ttlSeconds ?? 60 * 60 * 24); // default 24h
  const body: MagicLinkPayload = {
    sessionId: payload.sessionId,
    orderId: payload.orderId,
    email: payload.email.toLowerCase(),
    exp,
  };
  const encoded = base64url(JSON.stringify(body));
  const signature = hmac(encoded, secret);
  return `${encoded}.${signature}`;
}

export function verifyMagicToken(token: string): MagicLinkPayload | null {
  try {
    const secret = getSecret();
    const [encoded, sig] = token.split('.');
    if (!encoded || !sig) return null;
    const expectedSig = hmac(encoded, secret);
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return null;
    }
    const json = Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const payload = JSON.parse(json) as MagicLinkPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.sessionId || !payload.email) return null;
    return payload;
  } catch {
    return null;
  }
} 