import { pointInPolygon } from './geo/geo-context';
import { CityProfiles, CityProfileKey, Zones, withinBounds } from './geo/zones';
import type { LngLat } from './geo/geo-context';

export type VehicleType = 'Bike' | 'SWB' | 'LWB' | 'Luton';

export const Rates = {
  Bike: { basePence: 500, perKmPence: 80, minimumPence: 900 },
  SWB: { basePence: 900, perKmPence: 120, minimumPence: 1800 },
  LWB: { basePence: 1200, perKmPence: 150, minimumPence: 2200 },
  Luton: { basePence: 1500, perKmPence: 180, minimumPence: 2600 },
} as const;

export const Surcharges = {
  CC_PENCE: 1500,
  ULEZ_PENCE: 1250,
};

export function isInCC(point: LngLat): boolean {
  return pointInPolygon(point, Zones.LondonCC);
}

export function isInULEZ(point: LngLat): boolean {
  return pointInPolygon(point, Zones.LondonULEZ);
}

export function cityFor(pickup: LngLat, dropoff: LngLat): CityProfileKey {
  if (isInCC(pickup) || isInCC(dropoff) || isInULEZ(pickup) || isInULEZ(dropoff)) {
    return 'CentralLondon';
  }

  const all: CityProfileKey[] = ['Chester', 'Manchester', 'CentralLondon'];
  for (const key of all) {
    const profile = CityProfiles[key];
    if (withinBounds(pickup, profile.bbox) || withinBounds(dropoff, profile.bbox)) {
      return key;
    }
  }

  return 'Chester';
}

export function timeMultiplier(whenIso: string): number {
  const when = new Date(whenIso);
  if (Number.isNaN(when.getTime())) {
    return 1.0;
  }
  const hour = when.getUTCHours();
  const day = when.getUTCDay();
  const isWeekend = day === 0 || day === 6;
  if (isWeekend || hour >= 18 || hour < 6) {
    return 1.15;
  }
  return 1.0;
}

export function ltnMultiplier(pickup: LngLat, dropoff: LngLat): number {
  const profile = CityProfiles.CentralLondon;
  if (withinBounds(pickup, profile.bbox) && withinBounds(dropoff, profile.bbox)) {
    return 1.15;
  }
  return 1.0;
}

export function avgSpeedKph(city: CityProfileKey, vehicleType: VehicleType): number {
  return CityProfiles[city].avgSpeedKph[vehicleType];
}
