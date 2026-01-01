"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haversineKm = haversineKm;
exports.pointInPolygon = pointInPolygon;
exports.estimateDurationMin = estimateDurationMin;
var toRad = function (value) { return (value * Math.PI) / 180; };
function haversineKm(a, b) {
    var R = 6371; // Earth radius in km
    var dLat = toRad(b.lat - a.lat);
    var dLng = toRad(b.lng - a.lng);
    var lat1 = toRad(a.lat);
    var lat2 = toRad(b.lat);
    var sinLat = Math.sin(dLat / 2);
    var sinLng = Math.sin(dLng / 2);
    var h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
    return 2 * R * Math.asin(Math.sqrt(h));
}
function pointInPolygon(point, polygon) {
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i].lng;
        var yi = polygon[i].lat;
        var xj = polygon[j].lng;
        var yj = polygon[j].lat;
        var intersect = yi > point.lat !== yj > point.lat &&
            point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
}
function estimateDurationMin(distanceKm, avgSpeedKph) {
    var safeSpeed = Math.max(10, avgSpeedKph);
    var minutes = (distanceKm / safeSpeed) * 60;
    return Math.max(5, minutes);
}
