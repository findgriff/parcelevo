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
exports.NotificationsController = void 0;
var common_1 = require("@nestjs/common");
var zod_1 = require("zod");
var crypto_1 = require("crypto");
var notifications_service_1 = require("./notifications.service");
var TestSchema = zod_1.z.object({
    channel: zod_1.z.enum(['email', 'sms', 'push']),
    to: zod_1.z.string().min(1),
    count: zod_1.z.number().int().min(1).max(100).optional(),
    templateId: zod_1.z.string().optional(),
    vars: zod_1.z.record(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
});
var EmitSchema = zod_1.z.object({
    type: zod_1.z.enum(['offer_created', 'offer_expired', 'offer_accepted', 'job_status_changed']),
    to: zod_1.z
        .object({ email: zod_1.z.string().email().optional(), phone: zod_1.z.string().optional(), pushToken: zod_1.z.string().optional() })
        .optional(),
    templateId: zod_1.z.string().optional(),
    vars: zod_1.z.record(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
});
var NotificationsController = /** @class */ (function () {
    function NotificationsController(service) {
        this.service = service;
    }
    NotificationsController.prototype.test = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed, count, events, i;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parsed = TestSchema.parse(body);
                        count = (_a = parsed.count) !== null && _a !== void 0 ? _a : 1;
                        events = [];
                        for (i = 0; i < count; i++) {
                            events.push({
                                id: (0, crypto_1.randomUUID)(),
                                createdAt: new Date().toISOString(),
                                type: 'test',
                                channel: parsed.channel,
                                to: this.buildRecipient(parsed.channel, parsed.to),
                                templateId: parsed.templateId,
                                vars: parsed.vars,
                            });
                        }
                        return [4 /*yield*/, Promise.all(events.map(function (evt) { return _this.service.enqueue(evt); }))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, { queued: events.length }];
                }
            });
        });
    };
    NotificationsController.prototype.emit = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsed = EmitSchema.parse(body);
                        event = {
                            id: (0, crypto_1.randomUUID)(),
                            createdAt: new Date().toISOString(),
                            type: parsed.type,
                            to: parsed.to,
                            templateId: parsed.templateId,
                            vars: parsed.vars,
                        };
                        return [4 /*yield*/, this.service.enqueue(event)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { queued: 1 }];
                }
            });
        });
    };
    NotificationsController.prototype.metrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.service.getMetrics()];
            });
        });
    };
    NotificationsController.prototype.buildRecipient = function (channel, to) {
        var map = {
            email: { email: to },
            sms: { phone: to },
            push: { pushToken: to },
        };
        return map[channel];
    };
    __decorate([
        (0, common_1.Post)('test'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], NotificationsController.prototype, "test", null);
    __decorate([
        (0, common_1.Post)('emit'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], NotificationsController.prototype, "emit", null);
    __decorate([
        (0, common_1.Get)('metrics'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], NotificationsController.prototype, "metrics", null);
    NotificationsController = __decorate([
        (0, common_1.Controller)('notifications'),
        __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
    ], NotificationsController);
    return NotificationsController;
}());
exports.NotificationsController = NotificationsController;
