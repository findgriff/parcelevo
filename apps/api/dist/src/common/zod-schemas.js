"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOfferSchema = exports.DriverAvailabilitySchema = exports.CreateOrderSchema = void 0;
var zod_1 = require("zod");
exports.CreateOrderSchema = zod_1.z.object({
    pickupAddr: zod_1.z.string().min(1),
    pickupPostcode: zod_1.z.string().min(1),
    pickupTs: zod_1.z.string().datetime(),
    deliveryAddr: zod_1.z.string().min(1),
    deliveryPostcode: zod_1.z.string().min(1),
    deliveryTs: zod_1.z.string().datetime(),
    description: zod_1.z.string().optional(),
    category: zod_1.z.enum(['general', 'medical', 'legal']).optional(),
});
exports.DriverAvailabilitySchema = zod_1.z.object({
    state: zod_1.z.enum(['OFFLINE', 'AVAILABLE', 'PAUSED']),
});
exports.CreateOfferSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(1),
    driverId: zod_1.z.string().min(1),
    ratePence: zod_1.z.number().int().positive(),
});
