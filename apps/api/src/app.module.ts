import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';
import { OffersModule } from './offers/offers.module';
import { DriversModule } from './drivers/drivers.module';
import { PricingModule } from './pricing/pricing.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrdersModule,
    OffersModule,
    DriversModule,
    PricingModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
