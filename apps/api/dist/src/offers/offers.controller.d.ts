import { OffersService } from './offers.service';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
    createOffer(body: unknown): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.OfferStatus;
        expiresAt: Date;
    }>;
    acceptOffer(id: string): Promise<{
        status: string;
    }>;
    getOffer(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.OfferStatus;
        createdAt: Date;
        jobId: string;
        offerType: import("@prisma/client").$Enums.OfferType;
        ratePence: number;
        distanceToPickupKm: number | null;
        etaMin: number | null;
        expiresAt: Date;
        driverId: string;
    }>;
}
