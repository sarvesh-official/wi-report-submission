import fetch from 'node-fetch';
import { RequestBody, ZohoResponse } from '../types';
import { emailService } from './emailService';

export class FormSubmissionService {
  private readonly formUrl = 'https://forms.zohopublic.in/gurmindersinghkal1/form/Signup/formperma/GeJFMLBDfoWlIJfhI46Qyx0Dlf3kHhMSRsvMItq_Riw/records';
  
  async submitForm(requestBody: RequestBody): Promise<void> {
    try {
      const response = await fetch(this.formUrl, {
        headers: {
          accept: 'application/zoho.forms-v1+json',
          'content-type': 'application/json',
          Referer: 'https://forms.zohopublic.in/gurmindersinghkal1/form/Signup/formperma/GeJFMLBDfoWlIJfhI46Qyx0Dlf3kHhMSRsvMItq_Riw',
        },
        body: JSON.stringify(requestBody),
        method: 'POST'
      });
      
      const data = await response.json() as ZohoResponse;
      const status = data.open_thankyou_page_URL_in === 1 ? 'Success' : 'Failed';
      
      let emailMessage = `Status: ${status}\n\nKey Tasks: ${requestBody.MultiLine || 'N/A'}`;
      
      if (requestBody.MultiLine6) {
        emailMessage += `\n\nMeeting Highlights: ${requestBody.MultiLine6}`;
      }
      
      emailMessage += `\n\nResponse Data: ${JSON.stringify(data)}`;
      
      await emailService.sendEmail(
        'Auto Form Submission Report', 
        emailMessage, 
        requestBody.Email
      );
      
    } catch (error: any) {
      console.error('Error:', error);
      await emailService.sendEmail(
        'FAILED - Auto Form Submission Report',
        `Error: ${error}`,
        requestBody.Email
      );
    }
  }
}

export const formSubmissionService = new FormSubmissionService();

