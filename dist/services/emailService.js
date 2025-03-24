"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    async sendEmail(subject, message, to) {
        console.log("***********************");
        console.log('Sending email to:', to);
        console.log('Subject:', subject);
        console.log('Message:', message);
        console.log("***********************");
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to,
            subject,
            text: message
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.response);
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
exports.EmailService = EmailService;
exports.emailService = new EmailService();
