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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var offer_expiry_provider_1 = require("./expiry/offer-expiry.provider");
var OffersService = /** @class */ (function () {
    function OffersService(prisma, expiryProvider) {
        var _a;
        this.prisma = prisma;
        this.expiryProvider = expiryProvider;
        var ttl = Number((_a = process.env.OFFER_TTL_SECONDS) !== null && _a !== void 0 ? _a : '60');
        this.ttlSeconds = Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
    }
    OffersService.prototype.ensureDriver = function (driverId) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.driver.findUnique({ where: { id: driverId } })];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            return [2 /*return*/, existing];
                        }
                        return [4 /*yield*/, this.prisma.user.create({
                                data: {
                                    email: "driver+".concat(driverId, "@parcelevo.com"),
                                    role: 'driver',
                                },
                            })];
                    case 2:
                        user = _a.sent();
                        return [2 /*return*/, this.prisma.driver.create({
                                data: {
                                    id: driverId,
                                    userId: user.id,
                                    legalName: 'Driver',
                                },
                            })];
                }
            });
        });
    };
    OffersService.prototype.createOffer = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var job, expiresAt, offer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.job.findUnique({ where: { id: input.jobId } })];
                    case 1:
                        job = _a.sent();
                        if (!job) {
                            throw new common_1.NotFoundException('Job not found');
                        }
                        return [4 /*yield*/, this.ensureDriver(input.driverId)];
                    case 2:
                        _a.sent();
                        expiresAt = new Date(Date.now() + this.ttlSeconds * 1000);
                        return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var created;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.jobOffer.create({
                                                data: {
                                                    jobId: input.jobId,
                                                    driverId: input.driverId,
                                                    ratePence: input.ratePence,
                                                    offerType: 'push',
                                                    expiresAt: expiresAt,
                                                    status: 'pending',
                                                },
                                            })];
                                        case 1:
                                            created = _a.sent();
                                            if (!(job.status === 'created')) return [3 /*break*/, 4];
                                            return [4 /*yield*/, tx.job.update({
                                                    where: { id: job.id },
                                                    data: { status: 'offered' },
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, tx.jobEvent.create({
                                                    data: { jobId: job.id, type: 'offered' },
                                                })];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4: return [2 /*return*/, created];
                                    }
                                });
                            }); })];
                    case 3:
                        offer = _a.sent();
                        return [4 /*yield*/, this.expiryProvider.schedule(offer.id, expiresAt)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, offer];
                }
            });
        });
    };
    OffersService.prototype.acceptOffer = function (offerId) {
        return __awaiter(this, void 0, void 0, function () {
            var now, offer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        return [4 /*yield*/, this.prisma.jobOffer.findUnique({ where: { id: offerId } })];
                    case 1:
                        offer = _a.sent();
                        if (!offer) {
                            throw new common_1.NotFoundException('Offer not found');
                        }
                        if (offer.status !== 'pending' || offer.expiresAt <= now) {
                            throw new common_1.ConflictException('Offer expired or not pending');
                        }
                        return [4 /*yield*/, this.expiryProvider.cancel(offerId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.jobOffer.update({
                                                where: { id: offerId },
                                                data: { status: 'accepted' },
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, tx.job.update({
                                                    where: { id: offer.jobId },
                                                    data: { status: 'accepted' },
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, tx.jobEvent.create({
                                                    data: { jobId: offer.jobId, type: 'accepted' },
                                                })];
                                        case 3:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OffersService.prototype.expireOffer = function (offerId) {
        return __awaiter(this, void 0, void 0, function () {
            var now;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var offer, remaining;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.jobOffer.findUnique({ where: { id: offerId } })];
                                        case 1:
                                            offer = _a.sent();
                                            if (!offer || offer.status !== 'pending' || offer.expiresAt > now) {
                                                return [2 /*return*/];
                                            }
                                            return [4 /*yield*/, tx.jobOffer.update({
                                                    where: { id: offerId },
                                                    data: { status: 'expired' },
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, tx.jobOffer.count({
                                                    where: {
                                                        jobId: offer.jobId,
                                                        status: { in: ['pending', 'accepted'] },
                                                    },
                                                })];
                                        case 3:
                                            remaining = _a.sent();
                                            if (!(remaining === 0)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, tx.job.update({
                                                    where: { id: offer.jobId },
                                                    data: { status: 'created' },
                                                })];
                                        case 4:
                                            _a.sent();
                                            return [4 /*yield*/, tx.jobEvent.create({
                                                    data: {
                                                        jobId: offer.jobId,
                                                        type: 'exception',
                                                        meta: { reason: 'offer_expired', offerId: offerId },
                                                    },
                                                })];
                                        case 5:
                                            _a.sent();
                                            _a.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OffersService.prototype.getOffer = function (offerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.jobOffer.findUnique({ where: { id: offerId } })];
            });
        });
    };
    OffersService = __decorate([
        (0, common_1.Injectable)(),
        __param(1, (0, common_1.Inject)(offer_expiry_provider_1.OFFER_EXPIRY_PROVIDER)),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
    ], OffersService);
    return OffersService;
}());
exports.OffersService = OffersService;
