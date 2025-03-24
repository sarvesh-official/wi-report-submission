import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
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

  async sendEmail(subject: string, message: string, to: string): Promise<void> {
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
    } catch (error: any) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
