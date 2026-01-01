import type { NotificationEventType } from './types';
export declare const Templates: {
    offer_created: {
        subject: string;
        text: string;
        html: string;
    };
    offer_expired: {
        subject: string;
        text: string;
    };
    offer_accepted: {
        subject: string;
        text: string;
    };
    job_status: {
        subject: string;
        text: string;
    };
    test: {
        subject: string;
        text: string;
    };
};
export type TemplateKey = keyof typeof Templates;
export declare const TemplateLookup: Record<NotificationEventType, TemplateKey>;
export declare function renderTemplate(template: string, vars?: Record<string, any>): string;
