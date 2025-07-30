import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string | number
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
    algorithm: 'HS256',
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const jwtHelper = { createToken, verifyToken };
