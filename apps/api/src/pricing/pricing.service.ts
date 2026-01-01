import { Injectable } from '@nestjs/common';
import { estimateDurationMin, haversineKm, LngLat } from './geo/geo-context';
import { avgSpeedKph, cityFor, isInCC, isInULEZ, ltnMultiplier, Rates, Surcharges, timeMultiplier, VehicleType } from './rates';

export type PricingQuote = {
  currency: 'GBP';
  distanceKm: number;
  durationMin: number;
  basePence: number;
  surcharges: { code: string; amountPence: number; reason: string }[];
  totalPence: number;
  breakdown: {
    vehicleType: VehicleType;
    cityProfile: string;
    rateTable: (typeof Rates)[VehicleType];
    multipliers: { timeOfDay: number; ltn: number };
  };
};

export type PricingRequest = {
  pickup: LngLat;
  dropoff: LngLat;
  vehicleType: VehicleType;
  when: string;
};

@Injectable()
export class PricingService {
  computeQuote(request: PricingRequest): PricingQuote {
    const distanceKm = Number(haversineKm(request.pickup, request.dropoff).toFixed(2));
    const city = cityFor(request.pickup, request.dropoff);
    const rateTable = Rates[request.vehicleType];
    const avgSpeed = avgSpeedKph(city, request.vehicleType);
    const durationMin = Number(estimateDurationMin(distanceKm, avgSpeed).toFixed(1));

    const perKmDistance = Math.max(1, Math.ceil(distanceKm));
    const baseRaw = rateTable.basePence + rateTable.perKmPence * perKmDistance;
    const baseWithMinimum = Math.max(rateTable.minimumPence, baseRaw);

    const timeMul = timeMultiplier(request.when);
    const ltnMul = ltnMultiplier(request.pickup, request.dropoff);
    const basePence = Math.round(baseWithMinimum * timeMul * ltnMul);

    const surcharges = [] as { code: string; amountPence: number; reason: string }[];
    if (isInCC(request.pickup) || isInCC(request.dropoff)) {
      surcharges.push({ code: 'CC', amountPence: Surcharges.CC_PENCE, reason: 'London Congestion Charge' });
    }
    if ((isInULEZ(request.pickup) || isInULEZ(request.dropoff)) && request.vehicleType !== 'Bike') {
      surcharges.push({ code: 'ULEZ', amountPence: Surcharges.ULEZ_PENCE, reason: 'Central London ULEZ' });
    }

    const totalPence = basePence + surcharges.reduce((sum, entry) => sum + entry.amountPence, 0);

    return {
      currency: 'GBP',
      distanceKm,
      durationMin,
      basePence,
      surcharges,
      totalPence,
      breakdown: {
        vehicleType: request.vehicleType,
        cityProfile: city,
        rateTable,
        multipliers: {
          timeOfDay: timeMul,
          ltn: ltnMul,
        },
      },
    };
  }
}
