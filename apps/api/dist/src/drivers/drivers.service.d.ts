type AvailabilityState = 'OFFLINE' | 'AVAILABLE' | 'PAUSED';
export declare class DriversService {
    private readonly redis?;
    constructor();
    setAvailability(driverId: string, state: AvailabilityState): Promise<void>;
}
export {};
