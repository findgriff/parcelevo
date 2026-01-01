import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EmailChannel } from './channels/email.channel';
import { PushChannel } from './channels/push.channel';
import { SmsChannel } from './channels/sms.channel';
import { TemplateKey, TemplateLookup, Templates, renderTemplate } from './templates';
import { NotificationEvent } from './types';
import {
  BullMqNotifyQueue,
  InMemoryNotifyQueue,
  NotificationProcessor,
  NotifyQueue,
} from './queue/notify-queue.provider';

export type MetricsPayload = {
  windowSize: number;
  queued: number;
  processed: number;
  p50Ms: number;
  p95Ms: number;
  inFlight: number;
  queueDepth: number;
  sinceIso: string;
};

@Injectable()
export class NotificationsService implements OnModuleDestroy {
  private readonly queue: NotifyQueue;
  private latencies: number[] = [];
  private readonly latencyWindow = 200;
  private sinceIso = new Date().toISOString();
  private queuedCount = 0;
  private processedCount = 0;
  private inFlight = 0;

  constructor(
    private readonly emailChannel: EmailChannel,
    private readonly smsChannel: SmsChannel,
    private readonly pushChannel: PushChannel
  ) {
    const processor: NotificationProcessor = this.processEvent.bind(this);
    if (process.env.REDIS_URL) {
      this.queue = new BullMqNotifyQueue(processor);
    } else {
      this.queue = new InMemoryNotifyQueue(processor);
    }
  }

  async enqueue(event: NotificationEvent) {
    this.queuedCount++;
    await this.queue.enqueue(event);
  }

  async getMetrics(): Promise<MetricsPayload> {
    const depth = await this.queue.depth();
    return {
      windowSize: this.latencies.length,
      queued: this.queuedCount,
      processed: this.processedCount,
      p50Ms: this.computeQuantile(0.5),
      p95Ms: this.computeQuantile(0.95),
      inFlight: this.inFlight,
      queueDepth: depth,
      sinceIso: this.sinceIso,
    };
  }

  async onModuleDestroy() {
    await this.queue.close();
  }

  private async processEvent(event: NotificationEvent) {
    this.inFlight++;
    const start = Date.now();
    try {
      await this.dispatch(event);
      this.processedCount++;
    } catch (error) {
      console.error('Notification processing failed', error);
    } finally {
      this.recordLatency(Date.now() - start);
      this.inFlight--;
    }
  }

  private async dispatch(event: NotificationEvent) {
    const templateKey =
      ((event.templateId as TemplateKey) ?? TemplateLookup[event.type]) as TemplateKey | undefined;
    const template = templateKey ? Templates[templateKey] : undefined;
    const vars = event.vars ?? {};
    const subject = template ? renderTemplate(template.subject, vars) : event.type;
    const text = template ? renderTemplate(template.text, vars) : JSON.stringify(vars);
    const html = template?.html ? renderTemplate(template.html, vars) : undefined;

    const sendEmail = async () => {
      if (!event.to?.email) return;
      await this.emailChannel.send({ to: event.to.email, subject, text, html });
    };

    const sendSms = async () => {
      if (!event.to?.phone) return;
      await this.smsChannel.send({ to: event.to.phone, text });
    };

    const sendPush = async () => {
      if (!event.to?.pushToken) return;
      await this.pushChannel.send({ token: event.to.pushToken, title: subject, body: text });
    };

    if (event.channel) {
      if (event.channel === 'email') await sendEmail();
      if (event.channel === 'sms') await sendSms();
      if (event.channel === 'push') await sendPush();
      return;
    }

    await Promise.all([sendEmail(), sendSms(), sendPush()]);
  }

  private recordLatency(ms: number) {
    this.latencies.push(ms);
    if (this.latencies.length > this.latencyWindow) {
      this.latencies.shift();
    }
  }

  private computeQuantile(p: number): number {
    if (this.latencies.length === 0) {
      return 0;
    }
    const copy = [...this.latencies].sort((a, b) => a - b);
    const index = Math.min(copy.length - 1, Math.floor(p * copy.length));
    return copy[index];
  }
}
