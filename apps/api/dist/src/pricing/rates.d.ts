import { CityProfileKey } from './geo/zones';
import type { LngLat } from './geo/geo-context';
export type VehicleType = 'Bike' | 'SWB' | 'LWB' | 'Luton';
export declare const Rates: {
    readonly Bike: {
        readonly basePence: 500;
        readonly perKmPence: 80;
        readonly minimumPence: 900;
    };
    readonly SWB: {
        readonly basePence: 900;
        readonly perKmPence: 120;
        readonly minimumPence: 1800;
    };
    readonly LWB: {
        readonly basePence: 1200;
        readonly perKmPence: 150;
        readonly minimumPence: 2200;
    };
    readonly Luton: {
        readonly basePence: 1500;
        readonly perKmPence: 180;
        readonly minimumPence: 2600;
    };
};
export declare const Surcharges: {
    CC_PENCE: number;
    ULEZ_PENCE: number;
};
export declare function isInCC(point: LngLat): boolean;
export declare function isInULEZ(point: LngLat): boolean;
export declare function cityFor(pickup: LngLat, dropoff: LngLat): CityProfileKey;
export declare function timeMultiplier(whenIso: string): number;
export declare function ltnMultiplier(pickup: LngLat, dropoff: LngLat): number;
export declare function avgSpeedKph(city: CityProfileKey, vehicleType: VehicleType): number;
