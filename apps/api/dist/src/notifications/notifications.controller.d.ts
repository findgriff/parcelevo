import { NotificationsService, MetricsPayload } from './notifications.service';
export declare class NotificationsController {
    private readonly service;
    constructor(service: NotificationsService);
    test(body: unknown): Promise<{
        queued: number;
    }>;
    emit(body: unknown): Promise<{
        queued: number;
    }>;
    metrics(): Promise<MetricsPayload>;
    private buildRecipient;
}
