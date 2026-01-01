import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

type AvailabilityState = 'OFFLINE' | 'AVAILABLE' | 'PAUSED';

const memoryAvailability = new Map<string, AvailabilityState>();

@Injectable()
export class DriversService {
  private readonly redis?: Redis;

  constructor() {
    const url = process.env.REDIS_URL;
    if (url) {
      this.redis = new Redis(url);
    }
  }

  async setAvailability(driverId: string, state: AvailabilityState): Promise<void> {
    if (this.redis) {
      await this.redis.set(`availability:${driverId}`, state);
      return;
    }
    memoryAvailability.set(driverId, state);
  }
}
