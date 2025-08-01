import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';
import { JwtPayload } from 'jsonwebtoken';

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;
      if (!tokenWithBearer) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
      }

      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
        const token = tokenWithBearer.split(' ')[1];

        // ✅ Corrected cast
        const verifyUser = jwtHelper.verifyToken(
          token,
          config.jwt.jwt_secret as string
        );

        // ✅ Ensure it's not a string
        if (!verifyUser || typeof verifyUser === 'string') {
          throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token');
        }

        // ✅ Type-safe assignment
        req.user = verifyUser;

        // ✅ Role guard
        if (roles.length && !roles.includes(verifyUser.role)) {
          throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You don't have permission to access this API"
          );
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };

export default auth;
