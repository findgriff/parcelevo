import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { PricingService } from './pricing.service';

const QuoteSchema = z.object({
  pickup: z.object({ lat: z.number(), lng: z.number() }),
  dropoff: z.object({ lat: z.number(), lng: z.number() }),
  vehicleType: z.enum(['Bike', 'SWB', 'LWB', 'Luton']),
  when: z.string(),
});

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('quote')
  quote(@Body() body: unknown) {
    const parsed = QuoteSchema.parse(body);
    return this.pricingService.computeQuote(parsed);
  }
}
