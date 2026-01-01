import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(body: unknown): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
    }>;
    getOrder(id: string): Promise<{
        events: {
            id: string;
            jobId: string;
            type: import("@prisma/client").$Enums.JobEventType;
            ts: Date;
            meta: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        offers: {
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
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        pickupAddr: string;
        pickupPostcode: string;
        pickupTs: Date;
        deliveryAddr: string;
        deliveryPostcode: string;
        deliveryTs: Date;
        description: string | null;
        category: import("@prisma/client").$Enums.JobCategory;
        specialRequirements: import("@prisma/client/runtime/client").JsonValue | null;
        estDistanceKm: number | null;
        pricing: import("@prisma/client/runtime/client").JsonValue | null;
        updatedAt: Date;
        customerId: string;
    }>;
}
