export interface Person {
  email: string;
  type: 'wi' | 'simulated';
  company?: string;
  keyTasks: string[];
  meetingHighlights?: string[];
}

export interface FormValues {
  email: string;
  workIntegrationType: string;
  companyName: string;
  keyTasks: string;
  meetingHighlights: string;
}

export interface RequestBody {
  Email: string;
  Date: string;
  TermsConditions: string;
  Dropdown: string;
  Dropdown1?: string;
  MultiLine: string;
  Slider: string;
  MultiLine1: string;
  Slider2: string;
  MultiLine5: string;
  Radio?: string;
  MultiLine6?: string;
  REFERRER_NAME: string;
  [key: string]: string | undefined;
}

export interface ZohoResponse {
  open_thankyou_page_URL_in: number;
  [key: string]: any;
}
