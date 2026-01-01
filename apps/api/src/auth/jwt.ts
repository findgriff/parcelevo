import jwt from 'jsonwebtoken';

export type UserRole = 'customer' | 'driver' | 'ops';

export type AccessTokenPayload = {
  sub: string;
  role: UserRole;
};

type MagicLinkPayload = {
  email: string;
  type: 'magic';
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return secret;
};

export const issueAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { algorithm: 'HS256', expiresIn: '24h' });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }) as AccessTokenPayload;
};

export const issueMagicLinkToken = (email: string): string => {
  const payload: MagicLinkPayload = { email, type: 'magic' };
  return jwt.sign(payload, getJwtSecret(), { algorithm: 'HS256', expiresIn: '15m' });
};

export const verifyMagicLinkToken = (token: string): MagicLinkPayload => {
  const payload = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }) as MagicLinkPayload;
  if (payload.type !== 'magic' || !payload.email) {
    throw new Error('Invalid magic link token');
  }
  return payload;
};
