"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
var common_1 = require("@nestjs/common");
var notifications_controller_1 = require("./notifications.controller");
var notifications_service_1 = require("./notifications.service");
var email_channel_1 = require("./channels/email.channel");
var sms_channel_1 = require("./channels/sms.channel");
var push_channel_1 = require("./channels/push.channel");
var NotificationsModule = /** @class */ (function () {
    function NotificationsModule() {
    }
    NotificationsModule = __decorate([
        (0, common_1.Module)({
            controllers: [notifications_controller_1.NotificationsController],
            providers: [notifications_service_1.NotificationsService, email_channel_1.EmailChannel, sms_channel_1.SmsChannel, push_channel_1.PushChannel],
            exports: [notifications_service_1.NotificationsService],
        })
    ], NotificationsModule);
    return NotificationsModule;
}());
exports.NotificationsModule = NotificationsModule;
