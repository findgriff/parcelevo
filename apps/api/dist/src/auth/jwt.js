"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMagicLinkToken = exports.issueMagicLinkToken = exports.verifyAccessToken = exports.issueAccessToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var getJwtSecret = function () {
    var secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is required');
    }
    return secret;
};
var issueAccessToken = function (payload) {
    return jsonwebtoken_1.default.sign(payload, getJwtSecret(), { algorithm: 'HS256', expiresIn: '24h' });
};
exports.issueAccessToken = issueAccessToken;
var verifyAccessToken = function (token) {
    return jsonwebtoken_1.default.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
};
exports.verifyAccessToken = verifyAccessToken;
var issueMagicLinkToken = function (email) {
    var payload = { email: email, type: 'magic' };
    return jsonwebtoken_1.default.sign(payload, getJwtSecret(), { algorithm: 'HS256', expiresIn: '15m' });
};
exports.issueMagicLinkToken = issueMagicLinkToken;
var verifyMagicLinkToken = function (token) {
    var payload = jsonwebtoken_1.default.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
    if (payload.type !== 'magic' || !payload.email) {
        throw new Error('Invalid magic link token');
    }
    return payload;
};
exports.verifyMagicLinkToken = verifyMagicLinkToken;
