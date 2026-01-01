import { z } from 'zod';
export declare const CreateOrderSchema: z.ZodObject<{
    pickupAddr: z.ZodString;
    pickupPostcode: z.ZodString;
    pickupTs: z.ZodString;
    deliveryAddr: z.ZodString;
    deliveryPostcode: z.ZodString;
    deliveryTs: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["general", "medical", "legal"]>>;
}, "strip", z.ZodTypeAny, {
    pickupAddr: string;
    pickupPostcode: string;
    pickupTs: string;
    deliveryAddr: string;
    deliveryPostcode: string;
    deliveryTs: string;
    description?: string | undefined;
    category?: "general" | "medical" | "legal" | undefined;
}, {
    pickupAddr: string;
    pickupPostcode: string;
    pickupTs: string;
    deliveryAddr: string;
    deliveryPostcode: string;
    deliveryTs: string;
    description?: string | undefined;
    category?: "general" | "medical" | "legal" | undefined;
}>;
export declare const DriverAvailabilitySchema: z.ZodObject<{
    state: z.ZodEnum<["OFFLINE", "AVAILABLE", "PAUSED"]>;
}, "strip", z.ZodTypeAny, {
    state: "OFFLINE" | "AVAILABLE" | "PAUSED";
}, {
    state: "OFFLINE" | "AVAILABLE" | "PAUSED";
}>;
export declare const CreateOfferSchema: z.ZodObject<{
    jobId: z.ZodString;
    driverId: z.ZodString;
    ratePence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    jobId: string;
    driverId: string;
    ratePence: number;
}, {
    jobId: string;
    driverId: string;
    ratePence: number;
}>;
