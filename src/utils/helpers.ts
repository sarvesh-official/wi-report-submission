import { Person, FormValues, RequestBody } from '../types';

export function getRandomFromArray<T>(arr: T[]): T {
  if (!arr || arr.length === 0) throw new Error('Empty array provided');
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getFormValues(person: Person): FormValues {
  return {
    email: person.email,
    workIntegrationType: person.type === 'wi' ? 'Work Integrated - Industry' : 'Work Integrated - Simulated',
    companyName: person.company || '',
    keyTasks: person.keyTasks.length > 0 ? getRandomFromArray(person.keyTasks) : '',
    meetingHighlights: person.type === 'wi' && person.meetingHighlights ? 
      getRandomFromArray(person.meetingHighlights) : ''
  };
}

export function createRequestBody(person: Person, formValues: FormValues): RequestBody {
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
