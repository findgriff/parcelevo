import { DriversService } from './drivers.service';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    setAvailability(id: string, body: unknown): Promise<void>;
}
