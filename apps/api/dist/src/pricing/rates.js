"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Surcharges = exports.Rates = void 0;
exports.isInCC = isInCC;
exports.isInULEZ = isInULEZ;
exports.cityFor = cityFor;
exports.timeMultiplier = timeMultiplier;
exports.ltnMultiplier = ltnMultiplier;
exports.avgSpeedKph = avgSpeedKph;
var geo_context_1 = require("./geo/geo-context");
var zones_1 = require("./geo/zones");
exports.Rates = {
    Bike: { basePence: 500, perKmPence: 80, minimumPence: 900 },
    SWB: { basePence: 900, perKmPence: 120, minimumPence: 1800 },
    LWB: { basePence: 1200, perKmPence: 150, minimumPence: 2200 },
    Luton: { basePence: 1500, perKmPence: 180, minimumPence: 2600 },
};
exports.Surcharges = {
    CC_PENCE: 1500,
    ULEZ_PENCE: 1250,
};
function isInCC(point) {
    return (0, geo_context_1.pointInPolygon)(point, zones_1.Zones.LondonCC);
}
function isInULEZ(point) {
    return (0, geo_context_1.pointInPolygon)(point, zones_1.Zones.LondonULEZ);
}
function cityFor(pickup, dropoff) {
    if (isInCC(pickup) || isInCC(dropoff) || isInULEZ(pickup) || isInULEZ(dropoff)) {
        return 'CentralLondon';
    }
    var all = ['Chester', 'Manchester', 'CentralLondon'];
    for (var _i = 0, all_1 = all; _i < all_1.length; _i++) {
        var key = all_1[_i];
        var profile = zones_1.CityProfiles[key];
        if ((0, zones_1.withinBounds)(pickup, profile.bbox) || (0, zones_1.withinBounds)(dropoff, profile.bbox)) {
            return key;
        }
    }
    return 'Chester';
}
function timeMultiplier(whenIso) {
    var when = new Date(whenIso);
    if (Number.isNaN(when.getTime())) {
        return 1.0;
    }
    var hour = when.getUTCHours();
    var day = when.getUTCDay();
    var isWeekend = day === 0 || day === 6;
    if (isWeekend || hour >= 18 || hour < 6) {
        return 1.15;
    }
    return 1.0;
}
function ltnMultiplier(pickup, dropoff) {
    var profile = zones_1.CityProfiles.CentralLondon;
    if ((0, zones_1.withinBounds)(pickup, profile.bbox) && (0, zones_1.withinBounds)(dropoff, profile.bbox)) {
        return 1.15;
    }
    return 1.0;
}
function avgSpeedKph(city, vehicleType) {
    return zones_1.CityProfiles[city].avgSpeedKph[vehicleType];
}
