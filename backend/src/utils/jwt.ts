import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'projectforge_super_secret_jwt_key_2026_change_in_production';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: '7d',
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
