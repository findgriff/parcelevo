import { PricingService } from './pricing.service';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    quote(body: unknown): import("./pricing.service").PricingQuote;
}
