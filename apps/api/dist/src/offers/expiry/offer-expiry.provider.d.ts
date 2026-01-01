import { OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
export declare const OFFERS_SERVICE_TOKEN = "OFFERS_SERVICE";
export declare const OFFER_EXPIRY_PROVIDER = "OFFER_EXPIRY_PROVIDER";
export interface OfferExpiryProvider {
    schedule(offerId: string, runAt: Date): Promise<void>;
    cancel(offerId: string): Promise<void>;
}
export declare class InMemoryOfferExpiryProvider implements OfferExpiryProvider, OnModuleDestroy {
    private readonly moduleRef;
    private readonly timers;
    constructor(moduleRef: ModuleRef);
    schedule(offerId: string, runAt: Date): Promise<void>;
    cancel(offerId: string): Promise<void>;
    onModuleDestroy(): void;
}
export declare class RedisOfferExpiryProvider implements OfferExpiryProvider, OnModuleDestroy {
    private readonly moduleRef;
    private readonly logger;
    private readonly queue;
    private readonly worker;
    private readonly connection;
    constructor(moduleRef: ModuleRef);
    schedule(offerId: string, runAt: Date): Promise<void>;
    cancel(offerId: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
