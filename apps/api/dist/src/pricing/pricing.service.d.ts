import { LngLat } from './geo/geo-context';
import { Rates, VehicleType } from './rates';
export type PricingQuote = {
    currency: 'GBP';
    distanceKm: number;
    durationMin: number;
    basePence: number;
    surcharges: {
        code: string;
        amountPence: number;
        reason: string;
    }[];
    totalPence: number;
    breakdown: {
        vehicleType: VehicleType;
        cityProfile: string;
        rateTable: (typeof Rates)[VehicleType];
        multipliers: {
            timeOfDay: number;
            ltn: number;
        };
    };
};
export type PricingRequest = {
    pickup: LngLat;
    dropoff: LngLat;
    vehicleType: VehicleType;
    when: string;
};
export declare class PricingService {
    computeQuote(request: PricingRequest): PricingQuote;
}
