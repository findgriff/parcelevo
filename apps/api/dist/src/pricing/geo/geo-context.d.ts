export type LngLat = {
    lng: number;
    lat: number;
};
export declare function haversineKm(a: LngLat, b: LngLat): number;
export declare function pointInPolygon(point: LngLat, polygon: LngLat[]): boolean;
export declare function estimateDurationMin(distanceKm: number, avgSpeedKph: number): number;
