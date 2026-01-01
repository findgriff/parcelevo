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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
var common_1 = require("@nestjs/common");
var email_channel_1 = require("./channels/email.channel");
var push_channel_1 = require("./channels/push.channel");
var sms_channel_1 = require("./channels/sms.channel");
var templates_1 = require("./templates");
var notify_queue_provider_1 = require("./queue/notify-queue.provider");
var NotificationsService = /** @class */ (function () {
    function NotificationsService(emailChannel, smsChannel, pushChannel) {
        this.emailChannel = emailChannel;
        this.smsChannel = smsChannel;
        this.pushChannel = pushChannel;
        this.latencies = [];
        this.latencyWindow = 200;
        this.sinceIso = new Date().toISOString();
        this.queuedCount = 0;
        this.processedCount = 0;
        this.inFlight = 0;
        var processor = this.processEvent.bind(this);
        if (process.env.REDIS_URL) {
            this.queue = new notify_queue_provider_1.BullMqNotifyQueue(processor);
        }
        else {
            this.queue = new notify_queue_provider_1.InMemoryNotifyQueue(processor);
        }
    }
    NotificationsService.prototype.enqueue = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.queuedCount++;
                        return [4 /*yield*/, this.queue.enqueue(event)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService.prototype.getMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var depth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue.depth()];
                    case 1:
                        depth = _a.sent();
                        return [2 /*return*/, {
                                windowSize: this.latencies.length,
                                queued: this.queuedCount,
                                processed: this.processedCount,
                                p50Ms: this.computeQuantile(0.5),
                                p95Ms: this.computeQuantile(0.95),
                                inFlight: this.inFlight,
                                queueDepth: depth,
                                sinceIso: this.sinceIso,
                            }];
                }
            });
        });
    };
    NotificationsService.prototype.onModuleDestroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService.prototype.processEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var start, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.inFlight++;
                        start = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this.dispatch(event)];
                    case 2:
                        _a.sent();
                        this.processedCount++;
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Notification processing failed', error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        this.recordLatency(Date.now() - start);
                        this.inFlight--;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService.prototype.dispatch = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var templateKey, template, vars, subject, text, html, sendEmail, sendSms, sendPush;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        templateKey = ((_a = event.templateId) !== null && _a !== void 0 ? _a : templates_1.TemplateLookup[event.type]);
                        template = templateKey ? templates_1.Templates[templateKey] : undefined;
                        vars = (_b = event.vars) !== null && _b !== void 0 ? _b : {};
                        subject = template ? (0, templates_1.renderTemplate)(template.subject, vars) : event.type;
                        text = template ? (0, templates_1.renderTemplate)(template.text, vars) : JSON.stringify(vars);
                        html = (template === null || template === void 0 ? void 0 : template.html) ? (0, templates_1.renderTemplate)(template.html, vars) : undefined;
                        sendEmail = function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!((_a = event.to) === null || _a === void 0 ? void 0 : _a.email))
                                            return [2 /*return*/];
                                        return [4 /*yield*/, this.emailChannel.send({ to: event.to.email, subject: subject, text: text, html: html })];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        sendSms = function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!((_a = event.to) === null || _a === void 0 ? void 0 : _a.phone))
                                            return [2 /*return*/];
                                        return [4 /*yield*/, this.smsChannel.send({ to: event.to.phone, text: text })];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        sendPush = function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!((_a = event.to) === null || _a === void 0 ? void 0 : _a.pushToken))
                                            return [2 /*return*/];
                                        return [4 /*yield*/, this.pushChannel.send({ token: event.to.pushToken, title: subject, body: text })];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!event.channel) return [3 /*break*/, 7];
                        if (!(event.channel === 'email')) return [3 /*break*/, 2];
                        return [4 /*yield*/, sendEmail()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        if (!(event.channel === 'sms')) return [3 /*break*/, 4];
                        return [4 /*yield*/, sendSms()];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        if (!(event.channel === 'push')) return [3 /*break*/, 6];
                        return [4 /*yield*/, sendPush()];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/];
                    case 7: return [4 /*yield*/, Promise.all([sendEmail(), sendSms(), sendPush()])];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService.prototype.recordLatency = function (ms) {
        this.latencies.push(ms);
        if (this.latencies.length > this.latencyWindow) {
            this.latencies.shift();
        }
    };
    NotificationsService.prototype.computeQuantile = function (p) {
        if (this.latencies.length === 0) {
            return 0;
        }
        var copy = __spreadArray([], this.latencies, true).sort(function (a, b) { return a - b; });
        var index = Math.min(copy.length - 1, Math.floor(p * copy.length));
        return copy[index];
    };
    NotificationsService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [email_channel_1.EmailChannel,
            sms_channel_1.SmsChannel,
            push_channel_1.PushChannel])
    ], NotificationsService);
    return NotificationsService;
}());
exports.NotificationsService = NotificationsService;
