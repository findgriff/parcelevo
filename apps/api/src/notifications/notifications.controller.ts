import { Body, Controller, Get, Post } from '@nestjs/common';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { NotificationsService, MetricsPayload } from './notifications.service';
import { NotificationEvent, NotificationChannel } from './types';

const TestSchema = z.object({
  channel: z.enum(['email', 'sms', 'push']),
  to: z.string().min(1),
  count: z.number().int().min(1).max(100).optional(),
  templateId: z.string().optional(),
  vars: z.record(z.union([z.string(), z.number()])).optional(),
});

const EmitSchema = z.object({
  type: z.enum(['offer_created', 'offer_expired', 'offer_accepted', 'job_status_changed']),
  to: z
    .object({ email: z.string().email().optional(), phone: z.string().optional(), pushToken: z.string().optional() })
    .optional(),
  templateId: z.string().optional(),
  vars: z.record(z.union([z.string(), z.number()])).optional(),
});

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post('test')
  async test(@Body() body: unknown) {
    const parsed = TestSchema.parse(body);
    const count = parsed.count ?? 1;
    const events: NotificationEvent[] = [];
    for (let i = 0; i < count; i++) {
      events.push({
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        type: 'test',
        channel: parsed.channel as NotificationChannel,
        to: this.buildRecipient(parsed.channel, parsed.to),
        templateId: parsed.templateId,
        vars: parsed.vars,
      });
    }
    await Promise.all(events.map((evt) => this.service.enqueue(evt)));
    return { queued: events.length };
  }

  @Post('emit')
  async emit(@Body() body: unknown) {
    const parsed = EmitSchema.parse(body);
    const event: NotificationEvent = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      type: parsed.type,
      to: parsed.to,
      templateId: parsed.templateId,
      vars: parsed.vars,
    };
    await this.service.enqueue(event);
    return { queued: 1 };
  }

  @Get('metrics')
  async metrics(): Promise<MetricsPayload> {
    return this.service.getMetrics();
  }

  private buildRecipient(channel: string, to: string) {
    const map: Record<string, { email?: string; phone?: string; pushToken?: string }> = {
      email: { email: to },
      sms: { phone: to },
      push: { pushToken: to },
    };
    return map[channel];
  }
}
