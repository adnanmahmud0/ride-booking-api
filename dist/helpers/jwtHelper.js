"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelper = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, secret, expireTime) => {
    // Validate string expireTime format (e.g., '1s', '2m', '3h', '4d')
    if (typeof expireTime === 'string') {
        const validFormat = /^[0-9]+(\.[0-9]+)?[smhd]$/.test(expireTime);
        if (!validFormat) {
            throw new Error('Invalid expiresIn format. Use number (seconds) or string like "1s", "1m", "1h", "1d".');
        }
    }
    const options = {
        // @ts-ignore: TypeScript cannot infer 'JwtExpireTime' as 'number | StringValue | undefined'
        expiresIn: expireTime,
        algorithm: 'HS256',
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
};
exports.jwtHelper = { createToken, verifyToken };
