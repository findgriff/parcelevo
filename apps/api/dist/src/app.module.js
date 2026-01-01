"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var health_controller_1 = require("./health/health.controller");
var auth_module_1 = require("./auth/auth.module");
var prisma_module_1 = require("./prisma/prisma.module");
var orders_module_1 = require("./orders/orders.module");
var offers_module_1 = require("./offers/offers.module");
var drivers_module_1 = require("./drivers/drivers.module");
var pricing_module_1 = require("./pricing/pricing.module");
var notifications_module_1 = require("./notifications/notifications.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                prisma_module_1.PrismaModule,
                auth_module_1.AuthModule,
                orders_module_1.OrdersModule,
                offers_module_1.OffersModule,
                drivers_module_1.DriversModule,
                pricing_module_1.PricingModule,
                notifications_module_1.NotificationsModule,
            ],
            controllers: [health_controller_1.HealthController],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
