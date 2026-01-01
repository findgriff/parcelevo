import type { LngLat } from './geo-context';
export declare const Zones: {
    LondonCC: {
        lat: number;
        lng: number;
    }[];
    LondonULEZ: {
        lat: number;
        lng: number;
    }[];
};
export declare const CityProfiles: {
    readonly Chester: {
        readonly name: "Chester";
        readonly avgSpeedKph: {
            readonly Bike: 18;
            readonly SWB: 28;
            readonly LWB: 26;
            readonly Luton: 24;
        };
        readonly bbox: {
            readonly minLat: 53.17;
            readonly maxLat: 53.21;
            readonly minLng: -2.93;
            readonly maxLng: -2.85;
        };
    };
    readonly Manchester: {
        readonly name: "Manchester";
        readonly avgSpeedKph: {
            readonly Bike: 18;
            readonly SWB: 26;
            readonly LWB: 24;
            readonly Luton: 22;
        };
        readonly bbox: {
            readonly minLat: 53.4;
            readonly maxLat: 53.52;
            readonly minLng: -2.32;
            readonly maxLng: -2.18;
        };
    };
    readonly CentralLondon: {
        readonly name: "CentralLondon";
        readonly avgSpeedKph: {
            readonly Bike: 15;
            readonly SWB: 18;
            readonly LWB: 16;
            readonly Luton: 14;
        };
        readonly bbox: {
            readonly minLat: 51.48;
            readonly maxLat: 51.56;
            readonly minLng: -0.25;
            readonly maxLng: 0.05;
        };
    };
};
export type CityProfileKey = keyof typeof CityProfiles;
export declare function withinBounds(point: LngLat, bbox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}): boolean;
