"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
var common_1 = require("@nestjs/common");
var geo_context_1 = require("./geo/geo-context");
var rates_1 = require("./rates");
var PricingService = /** @class */ (function () {
    function PricingService() {
    }
    PricingService.prototype.computeQuote = function (request) {
        var distanceKm = Number((0, geo_context_1.haversineKm)(request.pickup, request.dropoff).toFixed(2));
        var city = (0, rates_1.cityFor)(request.pickup, request.dropoff);
        var rateTable = rates_1.Rates[request.vehicleType];
        var avgSpeed = (0, rates_1.avgSpeedKph)(city, request.vehicleType);
        var durationMin = Number((0, geo_context_1.estimateDurationMin)(distanceKm, avgSpeed).toFixed(1));
        var perKmDistance = Math.max(1, Math.ceil(distanceKm));
        var baseRaw = rateTable.basePence + rateTable.perKmPence * perKmDistance;
        var baseWithMinimum = Math.max(rateTable.minimumPence, baseRaw);
        var timeMul = (0, rates_1.timeMultiplier)(request.when);
        var ltnMul = (0, rates_1.ltnMultiplier)(request.pickup, request.dropoff);
        var basePence = Math.round(baseWithMinimum * timeMul * ltnMul);
        var surcharges = [];
        if ((0, rates_1.isInCC)(request.pickup) || (0, rates_1.isInCC)(request.dropoff)) {
            surcharges.push({ code: 'CC', amountPence: rates_1.Surcharges.CC_PENCE, reason: 'London Congestion Charge' });
        }
        if (((0, rates_1.isInULEZ)(request.pickup) || (0, rates_1.isInULEZ)(request.dropoff)) && request.vehicleType !== 'Bike') {
            surcharges.push({ code: 'ULEZ', amountPence: rates_1.Surcharges.ULEZ_PENCE, reason: 'Central London ULEZ' });
        }
        var totalPence = basePence + surcharges.reduce(function (sum, entry) { return sum + entry.amountPence; }, 0);
        return {
            currency: 'GBP',
            distanceKm: distanceKm,
            durationMin: durationMin,
            basePence: basePence,
            surcharges: surcharges,
            totalPence: totalPence,
            breakdown: {
                vehicleType: request.vehicleType,
                cityProfile: city,
                rateTable: rateTable,
                multipliers: {
                    timeOfDay: timeMul,
                    ltn: ltnMul,
                },
            },
        };
    };
    PricingService = __decorate([
        (0, common_1.Injectable)()
    ], PricingService);
    return PricingService;
}());
exports.PricingService = PricingService;
