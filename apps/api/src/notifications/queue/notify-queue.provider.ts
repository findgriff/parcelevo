import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { NotificationEvent } from '../types';

export type NotificationProcessor = (event: NotificationEvent) => Promise<void>;

export interface NotifyQueue {
  enqueue(event: NotificationEvent): Promise<void>;
  depth(): Promise<number>;
  close(): Promise<void>;
}

export class BullMqNotifyQueue implements NotifyQueue {
  private readonly connection: Redis;
  private readonly queue: Queue;
  private readonly worker: Worker;

  constructor(processor: NotificationProcessor) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error('REDIS_URL required for BullMqNotifyQueue');
    }
    this.connection = new Redis(url);
    this.queue = new Queue('notify', { connection: this.connection });
    this.worker = new Worker(
      'notify',
      async (job) => processor(job.data as NotificationEvent),
      { connection: this.connection, concurrency: 8 }
    );
    this.worker.on('failed', (job, err) => {
      console.error(`notify job failed ${job?.id}: ${err.message}`);
    });
  }

  async enqueue(event: NotificationEvent) {
    await this.queue.add('job', event, {
      jobId: event.id,
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  async depth() {
    const counts = await this.queue.getJobCounts('waiting', 'active', 'delayed');
    return counts.waiting + counts.active + counts.delayed;
  }

  async close() {
    await this.worker.close();
    await this.queue.close();
    await this.connection.quit();
  }
}

export class InMemoryNotifyQueue implements NotifyQueue {
  private readonly queue: NotificationEvent[] = [];
  private running = false;
  private stopped = false;

  constructor(private readonly processor: NotificationProcessor) {}

  async enqueue(event: NotificationEvent) {
    this.queue.push(event);
    this.schedule();
  }

  async depth() {
    return this.queue.length;
  }

  async close() {
    this.stopped = true;
    this.queue.length = 0;
  }

  private schedule() {
    if (this.running || this.stopped) {
      return;
    }
    this.running = true;
    setImmediate(() => this.drain());
  }

  private async drain() {
    while (this.queue.length && !this.stopped) {
      const event = this.queue.shift();
      if (event) {
        await this.processor(event);
      }
    }
    this.running = false;
  }
}
