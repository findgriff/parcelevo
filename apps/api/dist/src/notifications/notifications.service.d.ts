import { OnModuleDestroy } from '@nestjs/common';
import { EmailChannel } from './channels/email.channel';
import { PushChannel } from './channels/push.channel';
import { SmsChannel } from './channels/sms.channel';
import { NotificationEvent } from './types';
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
export declare class NotificationsService implements OnModuleDestroy {
    private readonly emailChannel;
    private readonly smsChannel;
    private readonly pushChannel;
    private readonly queue;
    private latencies;
    private readonly latencyWindow;
    private sinceIso;
    private queuedCount;
    private processedCount;
    private inFlight;
    constructor(emailChannel: EmailChannel, smsChannel: SmsChannel, pushChannel: PushChannel);
    enqueue(event: NotificationEvent): Promise<void>;
    getMetrics(): Promise<MetricsPayload>;
    onModuleDestroy(): Promise<void>;
    private processEvent;
    private dispatch;
    private recordLatency;
    private computeQuantile;
}
