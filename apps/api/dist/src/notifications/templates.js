"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateLookup = exports.Templates = void 0;
exports.renderTemplate = renderTemplate;
exports.Templates = {
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
exports.TemplateLookup = {
    offer_created: 'offer_created',
    offer_expired: 'offer_expired',
    offer_accepted: 'offer_accepted',
    job_status_changed: 'job_status',
    test: 'test',
};
function renderTemplate(template, vars) {
    return template.replace(/{{(\w+)}}/g, function (_match, key) {
        var value = vars === null || vars === void 0 ? void 0 : vars[key];
        if (value === undefined || value === null) {
            return '';
        }
        return String(value);
    });
}
