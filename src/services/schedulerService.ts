import { Person, FormValues, RequestBody } from '../types';
import { formSubmissionService } from './formSubmissionService';
import { promises as fs } from 'fs';
import * as cron from 'node-cron';

function getRandomFromArray<T>(arr: T[]): T {
  if (!arr || arr.length === 0) throw new Error('Empty array provided');
  return arr[Math.floor(Math.random() * arr.length)];
}

function getFormValues(person: Person): FormValues {
  return {
    email: person.email,
    workIntegrationType: person.type === 'wi' ? 'Work Integrated - Industry' : 'Work Integrated - Simulated',
    companyName: person.company || '',
    keyTasks: person.keyTasks.length > 0 ? getRandomFromArray(person.keyTasks) : '',
    meetingHighlights: person.type === 'wi' && person.meetingHighlights ? 
      getRandomFromArray(person.meetingHighlights) : ''
  };
}

function createRequestBody(person: Person, formValues: FormValues): RequestBody {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const monthAbbreviations = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = monthAbbreviations[today.getMonth()];
  const year = today.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const requestBody: RequestBody = {
    Email: formValues.email,
    Date: formattedDate,
    TermsConditions: 'true',
    Dropdown: formValues.workIntegrationType,
    Dropdown1: formValues.companyName || undefined,
    MultiLine: formValues.keyTasks,
    Slider: '5',
    MultiLine1: '',
    Slider2: '5',
    MultiLine5: '',
    Radio: person.type === 'wi' ? 'Yes' : undefined,
    MultiLine6: formValues.meetingHighlights || undefined,
    REFERRER_NAME: 'https://forms.zohopublic.in/gurmindersinghkal1/form/Signup/thankyou/formperma/GeJFMLBDfoWlIJfhI46Qyx0Dlf3kHhMSRsvMItq_Riw'
  };

  Object.keys(requestBody).forEach(key => {
    if (requestBody[key] === undefined) {
      delete requestBody[key];
    }
  });

  return requestBody;
}

export class SchedulerService {
  private readonly dataPath: string;
  private readonly hours: number;
  private readonly minutes: number;

  constructor(dataPath: string, hours: number = 12, minutes: number = 17) {
    this.dataPath = dataPath;
    this.hours = hours;
    this.minutes = minutes;
  }

  async loadPeopleData(): Promise<Person[]> {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data) as Person[];
    } catch (err: any) {
      console.error('Error reading folks data:', err);
      return [];
    }
  }

  async processSubmissions(): Promise<void> {
    console.log(`Running scheduled task at ${this.hours}:${this.minutes}...`);
    
    const folksData = await this.loadPeopleData();
    
    if (!folksData || folksData.length === 0) {
      console.error('No data found!');
      return;
    }
    
    console.log(`Processing ${folksData.length} submissions`);
    
    for (const person of folksData) {
      try {
        const formValues = getFormValues(person);
        const requestBody = createRequestBody(person, formValues);
        await formSubmissionService.submitForm(requestBody);
        // Add delay between submissions
        await new Promise(resolve => setTimeout(resolve, 10 * 1000));
      } catch (error: any) {
        console.error(`Error processing submission for ${person.email}:`, error);
      }
    }
  }

  startScheduler(): void {
    cron.schedule(
      `${this.minutes} ${this.hours} * * 1-5`,
      this.processSubmissions.bind(this),
      { scheduled: true, timezone: 'Asia/Kolkata' }
    );
    
    console.log(
      `Scheduler is running. The task will execute every weekday at ${this.hours}:${this.minutes}.`
    );
  }
}
