import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import {
  InMemoryOfferExpiryProvider,
  OFFERS_SERVICE_TOKEN,
  OFFER_EXPIRY_PROVIDER,
  RedisOfferExpiryProvider,
} from './expiry/offer-expiry.provider';

@Module({
  controllers: [OffersController],
  providers: [
    OffersService,
    {
      provide: OFFERS_SERVICE_TOKEN,
      useExisting: OffersService,
    },
    {
      provide: OFFER_EXPIRY_PROVIDER,
      useFactory: (moduleRef: ModuleRef) => {
        if (process.env.REDIS_URL) {
          return new RedisOfferExpiryProvider(moduleRef);
        }
        return new InMemoryOfferExpiryProvider(moduleRef);
      },
      inject: [ModuleRef],
    },
  ],
})
export class OffersModule {}
