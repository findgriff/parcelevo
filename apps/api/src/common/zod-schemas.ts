import { z } from 'zod';

export const CreateOrderSchema = z.object({
  pickupAddr: z.string().min(1),
  pickupPostcode: z.string().min(1),
  pickupTs: z.string().datetime(),
  deliveryAddr: z.string().min(1),
  deliveryPostcode: z.string().min(1),
  deliveryTs: z.string().datetime(),
  description: z.string().optional(),
  category: z.enum(['general', 'medical', 'legal']).optional(),
});

export const DriverAvailabilitySchema = z.object({
  state: z.enum(['OFFLINE', 'AVAILABLE', 'PAUSED']),
});

export const CreateOfferSchema = z.object({
  jobId: z.string().min(1),
  driverId: z.string().min(1),
  ratePence: z.number().int().positive(),
});
