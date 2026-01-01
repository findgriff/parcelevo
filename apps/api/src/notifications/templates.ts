import type { NotificationEventType } from './types';

export const Templates = {
  offer_created: {
    subject: 'New offer received for job {{jobId}}',
    text: 'New offer for job {{jobId}} at £{{price}}',
    html: '<p>New offer for job <strong>{{jobId}}</strong> at <strong>£{{price}}</strong></p>',
  },
  offer_expired: {
    subject: 'Offer expired for job {{jobId}}',
    text: 'Offer expired for job {{jobId}}',
  },
  offer_accepted: {
    subject: 'Offer accepted for job {{jobId}}',
    text: 'Offer accepted for job {{jobId}}',
  },
  job_status: {
    subject: 'Job {{jobId}} status: {{status}}',
    text: 'Job {{jobId}} is now {{status}}',
  },
  test: {
    subject: 'Test notification ({{type}})',
    text: 'Test notification for {{type}}',
  },
};

export type TemplateKey = keyof typeof Templates;

import type { NotificationEventType } from './types';

export const TemplateLookup: Record<NotificationEventType, TemplateKey> = {
  offer_created: 'offer_created',
  offer_expired: 'offer_expired',
  offer_accepted: 'offer_accepted',
  job_status_changed: 'job_status',
  test: 'test',
};

export function renderTemplate(template: string, vars?: Record<string, any>): string {
  return template.replace(/{{(\w+)}}/g, (_match, key) => {
    const value = vars?.[key];
    if (value === undefined || value === null) {
      return '';
    }
    return String(value);
  });
}
