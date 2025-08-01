import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

// Define valid expireTime formats (string formats supported by 'ms' or number in seconds)
type JwtExpireTime = string | number; // e.g., '1h', '2d', 3600

const createToken = (
  payload: Record<string, unknown>,
  secret: string,
  expireTime: JwtExpireTime
): string => {
  // Validate string expireTime format (e.g., '1s', '2m', '3h', '4d')
  if (typeof expireTime === 'string') {
    const validFormat = /^[0-9]+(\.[0-9]+)?[smhd]$/.test(expireTime);
    if (!validFormat) {
      throw new Error('Invalid expiresIn format. Use number (seconds) or string like "1s", "1m", "1h", "1d".');
    }
  }

  const options: SignOptions = {
    // @ts-ignore: TypeScript cannot infer 'JwtExpireTime' as 'number | StringValue | undefined'
    expiresIn: expireTime,
    algorithm: 'HS256',
  };
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: string): JwtPayload | string | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload | string;
  } catch (error) {
    return null;
  }
};

export const jwtHelper = { createToken, verifyToken };