"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const formSubmissionService_1 = require("./formSubmissionService");
const fs_1 = require("fs");
const cron = __importStar(require("node-cron"));
// Helper functions moved directly into this file to resolve import issues
function getRandomFromArray(arr) {
    if (!arr || arr.length === 0)
        throw new Error('Empty array provided');
    return arr[Math.floor(Math.random() * arr.length)];
}
function getFormValues(person) {
    return {
        email: person.email,
        workIntegrationType: person.type === 'wi' ? 'Work Integrated - Industry' : 'Work Integrated - Simulated',
        companyName: person.company || '',
        keyTasks: person.keyTasks.length > 0 ? getRandomFromArray(person.keyTasks) : '',
        meetingHighlights: person.type === 'wi' && person.meetingHighlights ?
            getRandomFromArray(person.meetingHighlights) : ''
    };
}
function createRequestBody(person, formValues) {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const monthAbbreviations = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthAbbreviations[today.getMonth()];
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const requestBody = {
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
class SchedulerService {
    constructor(dataPath, hours = 12, minutes = 17) {
        this.dataPath = dataPath;
        this.hours = hours;
        this.minutes = minutes;
    }
    async loadPeopleData() {
        try {
            const data = await fs_1.promises.readFile(this.dataPath, 'utf8');
            return JSON.parse(data);
        }
        catch (err) {
            console.error('Error reading folks data:', err);
            return [];
        }
    }
    async processSubmissions() {
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
                await formSubmissionService_1.formSubmissionService.submitForm(requestBody);
                // Add delay between submissions
                await new Promise(resolve => setTimeout(resolve, 10 * 1000));
            }
            catch (error) {
                console.error(`Error processing submission for ${person.email}:`, error);
            }
        }
    }
    startScheduler() {
        cron.schedule(`${this.minutes} ${this.hours} * * 1-5`, this.processSubmissions.bind(this), { scheduled: true, timezone: 'Asia/Kolkata' });
        console.log(`Scheduler is running. The task will execute every weekday at ${this.hours}:${this.minutes}.`);
    }
}
exports.SchedulerService = SchedulerService;
