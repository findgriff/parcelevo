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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var DEFAULT_CUSTOMER_EMAIL = 'customer@parcelevo.com';
var OrdersService = /** @class */ (function () {
    function OrdersService(prisma) {
        this.prisma = prisma;
    }
    OrdersService.prototype.getOrCreateDefaultCustomerId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var existing, created;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { email: DEFAULT_CUSTOMER_EMAIL },
                            select: { id: true },
                        })];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            return [2 /*return*/, existing.id];
                        }
                        return [4 /*yield*/, this.prisma.user.create({
                                data: { email: DEFAULT_CUSTOMER_EMAIL, role: 'customer' },
                                select: { id: true },
                            })];
                    case 2:
                        created = _a.sent();
                        return [2 /*return*/, created.id];
                }
            });
        });
    };
    OrdersService.prototype.createOrder = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var customerId, job;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrCreateDefaultCustomerId()];
                    case 1:
                        customerId = _a.sent();
                        return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var created;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, tx.job.create({
                                                data: {
                                                    customerId: customerId,
                                                    pickupAddr: input.pickupAddr,
                                                    pickupPostcode: input.pickupPostcode,
                                                    pickupTs: input.pickupTs,
                                                    deliveryAddr: input.deliveryAddr,
                                                    deliveryPostcode: input.deliveryPostcode,
                                                    deliveryTs: input.deliveryTs,
                                                    description: input.description,
                                                    category: (_a = input.category) !== null && _a !== void 0 ? _a : 'general',
                                                    status: 'created',
                                                },
                                                select: { id: true, status: true },
                                            })];
                                        case 1:
                                            created = _b.sent();
                                            return [4 /*yield*/, tx.jobEvent.create({
                                                    data: {
                                                        jobId: created.id,
                                                        type: 'created',
                                                    },
                                                })];
                                        case 2:
                                            _b.sent();
                                            return [2 /*return*/, created];
                                    }
                                });
                            }); })];
                    case 2:
                        job = _a.sent();
                        return [2 /*return*/, job];
                }
            });
        });
    };
    OrdersService.prototype.getOrder = function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.job.findUnique({
                        where: { id: jobId },
                        include: {
                            events: { orderBy: { ts: 'asc' } },
                            offers: { orderBy: { createdAt: 'asc' } },
                        },
                    })];
            });
        });
    };
    OrdersService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], OrdersService);
    return OrdersService;
}());
exports.OrdersService = OrdersService;
