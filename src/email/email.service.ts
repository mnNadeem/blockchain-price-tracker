import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
  }

  async sendEmail(chain: string, currentPrice: number, pastPrice: number) {
    await this.transporter.sendMail({
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `Price Alert: ${chain} has increased`,
      text: `The price of ${chain} has increased by more than 3%. Current price: ${currentPrice}, Previous price: ${pastPrice}.`,
    });
  }
}
