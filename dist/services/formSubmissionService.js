"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formSubmissionService = exports.FormSubmissionService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const emailService_1 = require("./emailService");
class FormSubmissionService {
    constructor() {
        this.formUrl = 'https://forms.zohopublic.in/gurmindersinghkal1/form/Signup/formperma/GeJFMLBDfoWlIJfhI46Qyx0Dlf3kHhMSRsvMItq_Riw/records';
    }
    async submitForm(requestBody) {
        try {
            const response = await (0, node_fetch_1.default)(this.formUrl, {
                headers: {
                    accept: 'application/zoho.forms-v1+json',
                    'content-type': 'application/json',
                    Referer: 'https://forms.zohopublic.in/gurmindersinghkal1/form/Signup/formperma/GeJFMLBDfoWlIJfhI46Qyx0Dlf3kHhMSRsvMItq_Riw',
                },
                body: JSON.stringify(requestBody),
                method: 'POST'
            });
            const data = await response.json();
            const status = data.open_thankyou_page_URL_in === 1 ? 'Success' : 'Failed';
            let emailMessage = `Status: ${status}\n\nKey Tasks: ${requestBody.MultiLine || 'N/A'}`;
            if (requestBody.MultiLine6) {
                emailMessage += `\n\nMeeting Highlights: ${requestBody.MultiLine6}`;
            }
            emailMessage += `\n\nResponse Data: ${JSON.stringify(data)}`;
            await emailService_1.emailService.sendEmail('Auto Form Submission Report', emailMessage, requestBody.Email);
        }
        catch (error) {
            console.error('Error:', error);
            await emailService_1.emailService.sendEmail('FAILED - Auto Form Submission Report', `Error: ${error}`, requestBody.Email);
        }
    }
}
exports.FormSubmissionService = FormSubmissionService;
exports.formSubmissionService = new FormSubmissionService();
