"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var nodemailer_1 = __importDefault(require("nodemailer"));
var prisma_service_1 = require("../prisma/prisma.service");
var jwt_1 = require("./jwt");
var requireEnv = function (name) {
    var value = process.env[name];
    if (!value) {
        throw new common_1.InternalServerErrorException("".concat(name, " is required"));
    }
    return value;
};
var AuthService = /** @class */ (function () {
    function AuthService(prisma) {
        this.prisma = prisma;
    }
    AuthService.prototype.sendMagicLink = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var baseUrl, magicToken, url, smtpUrl, from, transporter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseUrl = requireEnv('PUBLIC_BASE_URL').replace(/\/$/, '');
                        magicToken = (0, jwt_1.issueMagicLinkToken)(email);
                        url = "".concat(baseUrl, "/v1/auth/callback?token=").concat(encodeURIComponent(magicToken));
                        smtpUrl = process.env.MAGICLINK_SMTP_URL;
                        if (!smtpUrl) {
                            console.log("[DEV] Magic link for ".concat(email, ": ").concat(url));
                            return [2 /*return*/];
                        }
                        from = requireEnv('MAGICLINK_FROM');
                        transporter = nodemailer_1.default.createTransport(smtpUrl);
                        return [4 /*yield*/, transporter.sendMail({
                                from: from,
                                to: email,
                                subject: 'Your ParcelEvo magic link',
                                text: "Sign in: ".concat(url),
                                html: "<p>Sign in: <a href=\"".concat(url, "\">").concat(url, "</a></p>"),
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.exchangeMagicLink = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var email, payload, seedOpsEmail, defaultRole, user, tokenPayload;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        try {
                            payload = (0, jwt_1.verifyMagicLinkToken)(token);
                            email = payload.email.toLowerCase();
                        }
                        catch (_c) {
                            throw new common_1.UnauthorizedException('Invalid or expired magic link');
                        }
                        seedOpsEmail = (_a = process.env.SEED_OPS_EMAIL) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                        defaultRole = seedOpsEmail && email === seedOpsEmail ? 'ops' : 'customer';
                        return [4 /*yield*/, this.prisma.user.upsert({
                                where: { email: email },
                                update: {},
                                create: {
                                    email: email,
                                    role: defaultRole,
                                },
                            })];
                    case 1:
                        user = _b.sent();
                        tokenPayload = { sub: user.id, role: user.role };
                        return [2 /*return*/, {
                                token: (0, jwt_1.issueAccessToken)(tokenPayload),
                                user: { id: user.id, email: user.email, role: user.role },
                            }];
                }
            });
        });
    };
    AuthService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
