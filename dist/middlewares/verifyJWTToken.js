"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = validateToken;
const jose_1 = require("jose");
const JWKS = (0, jose_1.createRemoteJWKSet)(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));
async function validateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const { payload } = await (0, jose_1.jwtVerify)(token, JWKS, {
            issuer: process.env.CLIENT_URL,
            audience: process.env.CLIENT_URL,
        });
        req.user = payload;
        next();
    }
    catch (error) {
        console.error('Token validation failed:', error);
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
    }
}
