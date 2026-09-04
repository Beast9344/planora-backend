/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import { envVars } from '../config/env.config';
import AppError from '../errorHelpers/AppError';
import status from 'http-status';
import path from 'path';
import ejs from 'ejs';

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  port: parseInt(envVars.EMAIL_SENDER.SMTP_PORT),
});

const DEFAULT_TEMPLATES: Record<string, string> = {
  otp: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #333;">Hello <%= name %>,</h2>
      <p style="font-size: 16px; color: #555;">Your verification code is:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #4F46E5; margin: 20px 0; padding: 12px; background: #f3f4f6; text-align: center; border-radius: 6px;">
        <%= otp %>
      </div>
      <p style="font-size: 14px; color: #777;">This OTP will expire in 2 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `,
};

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  attachments,
}: SendEmailOptions) => {
  try {
    if (!envVars.EMAIL_SENDER.SMTP_USER || !envVars.EMAIL_SENDER.SMTP_PASS) {
      console.warn('⚠️ SMTP user or password is missing in environment variables. Email will not be sent.');
      return;
    }

    let html: string;
    try {
      const templatePath = path.resolve(
        process.cwd(),
        `src/app/templates/${templateName}.ejs`,
      );
      html = await ejs.renderFile(templatePath, templateData);
    } catch {
      const inlineTemplate = DEFAULT_TEMPLATES[templateName] || `<h2>Hello <%= name %></h2><p>Your OTP is <%= otp %>.</p>`;
      html = ejs.render(inlineTemplate, templateData);
    }

    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`Email send to ${to} :${info.messageId}`);
  } catch (error: any) {
    console.error('Email sending error:', error.message || error);
    // Don't throw fatal error if SMTP is not configured or fails, log it instead
    return;
  }
};

