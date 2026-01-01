import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OFFER_EXPIRY_PROVIDER, type OfferExpiryProvider } from './expiry/offer-expiry.provider';

@Injectable()
export class OffersService {
  private readonly ttlSeconds: number;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(OFFER_EXPIRY_PROVIDER) private readonly expiryProvider: OfferExpiryProvider
  ) {
    const ttl = Number(process.env.OFFER_TTL_SECONDS ?? '60');
    this.ttlSeconds = Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
  }

  private async ensureDriver(driverId: string) {
    const existing = await this.prisma.driver.findUnique({ where: { id: driverId } });
    if (existing) {
      return existing;
    }
    const user = await this.prisma.user.create({
      data: {
        email: `driver+${driverId}@parcelevo.com`,
        role: 'driver',
      },
    });
    return this.prisma.driver.create({
      data: {
        id: driverId,
        userId: user.id,
        legalName: 'Driver',
      },
    });
  }

  async createOffer(input: { jobId: string; driverId: string; ratePence: number }) {
    const job = await this.prisma.job.findUnique({ where: { id: input.jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await this.ensureDriver(input.driverId);

    const expiresAt = new Date(Date.now() + this.ttlSeconds * 1000);
    const offer = await this.prisma.$transaction(async (tx) => {
      const created = await tx.jobOffer.create({
        data: {
          jobId: input.jobId,
          driverId: input.driverId,
          ratePence: input.ratePence,
          offerType: 'push',
          expiresAt,
          status: 'pending',
        },
      });

      if (job.status === 'created') {
        await tx.job.update({
          where: { id: job.id },
          data: { status: 'offered' },
        });
        await tx.jobEvent.create({
          data: { jobId: job.id, type: 'offered' },
        });
      }

      return created;
    });

    await this.expiryProvider.schedule(offer.id, expiresAt);
    return offer;
  }

  async acceptOffer(offerId: string) {
    const now = new Date();
    const offer = await this.prisma.jobOffer.findUnique({ where: { id: offerId } });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    if (offer.status !== 'pending' || offer.expiresAt <= now) {
      throw new ConflictException('Offer expired or not pending');
    }

    await this.expiryProvider.cancel(offerId);

    await this.prisma.$transaction(async (tx) => {
      await tx.jobOffer.update({
        where: { id: offerId },
        data: { status: 'accepted' },
      });
      await tx.job.update({
        where: { id: offer.jobId },
        data: { status: 'accepted' },
      });
      await tx.jobEvent.create({
        data: { jobId: offer.jobId, type: 'accepted' },
      });
    });
  }

  async expireOffer(offerId: string) {
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      const offer = await tx.jobOffer.findUnique({ where: { id: offerId } });
      if (!offer || offer.status !== 'pending' || offer.expiresAt > now) {
        return;
      }

      await tx.jobOffer.update({
        where: { id: offerId },
        data: { status: 'expired' },
      });

      const remaining = await tx.jobOffer.count({
        where: {
          jobId: offer.jobId,
          status: { in: ['pending', 'accepted'] },
        },
      });

      if (remaining === 0) {
        await tx.job.update({
          where: { id: offer.jobId },
          data: { status: 'created' },
        });
        await tx.jobEvent.create({
          data: {
            jobId: offer.jobId,
            type: 'exception',
            meta: { reason: 'offer_expired', offerId },
          },
        });
      }
    });
  }

  async getOffer(offerId: string) {
    return this.prisma.jobOffer.findUnique({ where: { id: offerId } });
  }
}
