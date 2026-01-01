export type NotificationChannel = 'email' | 'sms' | 'push';
export type NotificationEventType = 'offer_created' | 'offer_expired' | 'offer_accepted' | 'job_status_changed' | 'test';
export type NotificationEvent = {
    id: string;
    createdAt: string;
    type: NotificationEventType;
    channel?: NotificationChannel;
    to?: {
        email?: string;
        phone?: string;
        pushToken?: string;
    };
    templateId?: string;
    vars?: Record<string, any>;
};
