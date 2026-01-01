import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
export const OFFERS_SERVICE_TOKEN = 'OFFERS_SERVICE';

export const OFFER_EXPIRY_PROVIDER = 'OFFER_EXPIRY_PROVIDER';

export interface OfferExpiryProvider {
  schedule(offerId: string, runAt: Date): Promise<void>;
  cancel(offerId: string): Promise<void>;
}

@Injectable()
export class InMemoryOfferExpiryProvider implements OfferExpiryProvider, OnModuleDestroy {
  private readonly timers = new Map<string, NodeJS.Timeout>();

  constructor(private readonly moduleRef: ModuleRef) {}

  async schedule(offerId: string, runAt: Date): Promise<void> {
    await this.cancel(offerId);
    const delayMs = Math.max(runAt.getTime() - Date.now(), 0);
    const timer = setTimeout(async () => {
      const service = this.moduleRef.get(OFFERS_SERVICE_TOKEN, { strict: false }) as
        | { expireOffer: (id: string) => Promise<void> }
        | undefined;
      await service?.expireOffer(offerId);
      this.timers.delete(offerId);
    }, delayMs);
    this.timers.set(offerId, timer);
  }

  async cancel(offerId: string): Promise<void> {
    const timer = this.timers.get(offerId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(offerId);
    }
  }

  onModuleDestroy() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}

@Injectable()
export class RedisOfferExpiryProvider implements OfferExpiryProvider, OnModuleDestroy {
  private readonly logger = new Logger(RedisOfferExpiryProvider.name);
  private readonly queue: Queue;
  private readonly worker: Worker;
  private readonly connection: Redis;

  constructor(private readonly moduleRef: ModuleRef) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error('REDIS_URL is required for RedisOfferExpiryProvider');
    }
    this.connection = new Redis(url);
    this.queue = new Queue('offer-expiry', { connection: this.connection });
    this.worker = new Worker(
      'offer-expiry',
      async (job) => {
        const { offerId } = job.data as { offerId: string };
        const service = this.moduleRef.get(OFFERS_SERVICE_TOKEN, { strict: false }) as
          | { expireOffer: (id: string) => Promise<void> }
          | undefined;
        await service?.expireOffer(offerId);
      },
      { connection: this.connection }
    );
    this.worker.on('failed', (job, err) => {
      this.logger.error(`Expiry job failed for ${job?.id}: ${err.message}`);
    });
  }

  async schedule(offerId: string, runAt: Date): Promise<void> {
    const delayMs = Math.max(runAt.getTime() - Date.now(), 0);
    await this.queue.add(
      'expire',
      { offerId },
      {
        jobId: `offer:${offerId}`,
        delay: delayMs,
        removeOnComplete: true,
      }
    );
  }

  async cancel(offerId: string): Promise<void> {
    await this.queue.remove(`offer:${offerId}`);
  }

  async onModuleDestroy() {
    await this.worker.close();
    await this.queue.close();
    await this.connection.quit();
  }
}
