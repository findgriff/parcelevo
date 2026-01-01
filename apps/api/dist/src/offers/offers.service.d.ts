import { PrismaService } from '../prisma/prisma.service';
import { type OfferExpiryProvider } from './expiry/offer-expiry.provider';
export declare class OffersService {
    private readonly prisma;
    private readonly expiryProvider;
    private readonly ttlSeconds;
    constructor(prisma: PrismaService, expiryProvider: OfferExpiryProvider);
    private ensureDriver;
    createOffer(input: {
        jobId: string;
        driverId: string;
        ratePence: number;
    }): Promise<{
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
    acceptOffer(offerId: string): Promise<void>;
    expireOffer(offerId: string): Promise<void>;
    getOffer(offerId: string): Promise<{
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
    } | null>;
}
