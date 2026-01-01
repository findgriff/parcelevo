"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityProfiles = exports.Zones = void 0;
exports.withinBounds = withinBounds;
exports.Zones = {
    LondonCC: [
        { lat: 51.5155, lng: -0.180 },
        { lat: 51.5205, lng: -0.070 },
        { lat: 51.5100, lng: -0.050 },
        { lat: 51.5000, lng: -0.060 },
        { lat: 51.4950, lng: -0.100 },
        { lat: 51.5000, lng: -0.170 },
    ],
    LondonULEZ: [
        { lat: 51.525, lng: -0.200 },
        { lat: 51.530, lng: 0.010 },
        { lat: 51.490, lng: 0.020 },
        { lat: 51.470, lng: -0.030 },
        { lat: 51.470, lng: -0.150 },
    ],
};
exports.CityProfiles = {
    Chester: {
        name: 'Chester',
        avgSpeedKph: { Bike: 18, SWB: 28, LWB: 26, Luton: 24 },
        bbox: { minLat: 53.170, maxLat: 53.210, minLng: -2.9300, maxLng: -2.850 },
    },
    Manchester: {
        name: 'Manchester',
        avgSpeedKph: { Bike: 18, SWB: 26, LWB: 24, Luton: 22 },
        bbox: { minLat: 53.40, maxLat: 53.52, minLng: -2.32, maxLng: -2.18 },
    },
    CentralLondon: {
        name: 'CentralLondon',
        avgSpeedKph: { Bike: 15, SWB: 18, LWB: 16, Luton: 14 },
        bbox: { minLat: 51.48, maxLat: 51.56, minLng: -0.25, maxLng: 0.05 },
    },
};
function withinBounds(point, bbox) {
    return (point.lat >= bbox.minLat &&
        point.lat <= bbox.maxLat &&
        point.lng >= bbox.minLng &&
        point.lng <= bbox.maxLng);
}
