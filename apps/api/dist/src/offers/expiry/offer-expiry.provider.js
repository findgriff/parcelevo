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
exports.RedisOfferExpiryProvider = exports.InMemoryOfferExpiryProvider = exports.OFFER_EXPIRY_PROVIDER = exports.OFFERS_SERVICE_TOKEN = void 0;
var common_1 = require("@nestjs/common");
var core_1 = require("@nestjs/core");
var bullmq_1 = require("bullmq");
var ioredis_1 = __importDefault(require("ioredis"));
exports.OFFERS_SERVICE_TOKEN = 'OFFERS_SERVICE';
exports.OFFER_EXPIRY_PROVIDER = 'OFFER_EXPIRY_PROVIDER';
var InMemoryOfferExpiryProvider = /** @class */ (function () {
    function InMemoryOfferExpiryProvider(moduleRef) {
        this.moduleRef = moduleRef;
        this.timers = new Map();
    }
    InMemoryOfferExpiryProvider.prototype.schedule = function (offerId, runAt) {
        return __awaiter(this, void 0, void 0, function () {
            var delayMs, timer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cancel(offerId)];
                    case 1:
                        _a.sent();
                        delayMs = Math.max(runAt.getTime() - Date.now(), 0);
                        timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var service;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        service = this.moduleRef.get(exports.OFFERS_SERVICE_TOKEN, { strict: false });
                                        return [4 /*yield*/, (service === null || service === void 0 ? void 0 : service.expireOffer(offerId))];
                                    case 1:
                                        _a.sent();
                                        this.timers.delete(offerId);
                                        return [2 /*return*/];
                                }
                            });
                        }); }, delayMs);
                        this.timers.set(offerId, timer);
                        return [2 /*return*/];
                }
            });
        });
    };
    InMemoryOfferExpiryProvider.prototype.cancel = function (offerId) {
        return __awaiter(this, void 0, void 0, function () {
            var timer;
            return __generator(this, function (_a) {
                timer = this.timers.get(offerId);
                if (timer) {
                    clearTimeout(timer);
                    this.timers.delete(offerId);
                }
                return [2 /*return*/];
            });
        });
    };
    InMemoryOfferExpiryProvider.prototype.onModuleDestroy = function () {
        this.timers.forEach(function (timer) { return clearTimeout(timer); });
        this.timers.clear();
    };
    InMemoryOfferExpiryProvider = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [core_1.ModuleRef])
    ], InMemoryOfferExpiryProvider);
    return InMemoryOfferExpiryProvider;
}());
exports.InMemoryOfferExpiryProvider = InMemoryOfferExpiryProvider;
var RedisOfferExpiryProvider = /** @class */ (function () {
    function RedisOfferExpiryProvider(moduleRef) {
        var _this = this;
        this.moduleRef = moduleRef;
        this.logger = new common_1.Logger(RedisOfferExpiryProvider_1.name);
        var url = process.env.REDIS_URL;
        if (!url) {
            throw new Error('REDIS_URL is required for RedisOfferExpiryProvider');
        }
        this.connection = new ioredis_1.default(url);
        this.queue = new bullmq_1.Queue('offer-expiry', { connection: this.connection });
        this.worker = new bullmq_1.Worker('offer-expiry', function (job) { return __awaiter(_this, void 0, void 0, function () {
            var offerId, service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offerId = job.data.offerId;
                        service = this.moduleRef.get(exports.OFFERS_SERVICE_TOKEN, { strict: false });
                        return [4 /*yield*/, (service === null || service === void 0 ? void 0 : service.expireOffer(offerId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, { connection: this.connection });
        this.worker.on('failed', function (job, err) {
            _this.logger.error("Expiry job failed for ".concat(job === null || job === void 0 ? void 0 : job.id, ": ").concat(err.message));
        });
    }
    RedisOfferExpiryProvider_1 = RedisOfferExpiryProvider;
    RedisOfferExpiryProvider.prototype.schedule = function (offerId, runAt) {
        return __awaiter(this, void 0, void 0, function () {
            var delayMs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delayMs = Math.max(runAt.getTime() - Date.now(), 0);
                        return [4 /*yield*/, this.queue.add('expire', { offerId: offerId }, {
                                jobId: "offer:".concat(offerId),
                                delay: delayMs,
                                removeOnComplete: true,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisOfferExpiryProvider.prototype.cancel = function (offerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue.remove("offer:".concat(offerId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisOfferExpiryProvider.prototype.onModuleDestroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.worker.close()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.queue.close()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.connection.quit()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var RedisOfferExpiryProvider_1;
    RedisOfferExpiryProvider = RedisOfferExpiryProvider_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [core_1.ModuleRef])
    ], RedisOfferExpiryProvider);
    return RedisOfferExpiryProvider;
}());
exports.RedisOfferExpiryProvider = RedisOfferExpiryProvider;
