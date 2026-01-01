import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_CUSTOMER_EMAIL = 'customer@parcelevo.com';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateDefaultCustomerId(): Promise<string> {
    const existing = await this.prisma.user.findUnique({
      where: { email: DEFAULT_CUSTOMER_EMAIL },
      select: { id: true },
    });
    if (existing) {
      return existing.id;
    }

    const created = await this.prisma.user.create({
      data: { email: DEFAULT_CUSTOMER_EMAIL, role: 'customer' },
      select: { id: true },
    });
    return created.id;
  }

  async createOrder(input: {
    pickupAddr: string;
    pickupPostcode: string;
    pickupTs: Date;
    deliveryAddr: string;
    deliveryPostcode: string;
    deliveryTs: Date;
    description?: string;
    category?: 'general' | 'medical' | 'legal';
  }) {
    const customerId = await this.getOrCreateDefaultCustomerId();

    const job = await this.prisma.$transaction(async (tx) => {
      const created = await tx.job.create({
        data: {
          customerId,
          pickupAddr: input.pickupAddr,
          pickupPostcode: input.pickupPostcode,
          pickupTs: input.pickupTs,
          deliveryAddr: input.deliveryAddr,
          deliveryPostcode: input.deliveryPostcode,
          deliveryTs: input.deliveryTs,
          description: input.description,
          category: input.category ?? 'general',
          status: 'created',
        },
        select: { id: true, status: true },
      });

      await tx.jobEvent.create({
        data: {
          jobId: created.id,
          type: 'created',
        },
      });

      return created;
    });

    return job;
  }

  async getOrder(jobId: string) {
    return this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        events: { orderBy: { ts: 'asc' } },
        offers: { orderBy: { createdAt: 'asc' } },
      },
    });
  }
}
