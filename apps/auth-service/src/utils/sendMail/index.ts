import dotenv from 'dotenv';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Get the correct template directory path
const getTemplatePath = (templateName: string, extension: string): string => {
  // Try multiple possible paths to find the template
  const possiblePaths = [
    // Development path (when running from source)
    path.join(
      __dirname,
      '..',
      '..',
      '..',
      'email-templates',
      `${templateName}.${extension}`
    ),
    // Production path (when running from dist)
    path.join(
      __dirname,
      '..',
      '..',
      'email-templates',
      `${templateName}.${extension}`
    ),
    // Alternative path (relative to project root)
    path.join(
      process.cwd(),
      'apps',
      'auth-service',
      'email-templates',
      `${templateName}.${extension}`
    ),
    // Fallback path (relative to current working directory)
    path.join(process.cwd(), 'email-templates', `${templateName}.${extension}`),
  ];

  // Return the first path that exists
  for (const templatePath of possiblePaths) {
    try {
      if (require('fs').existsSync(templatePath)) {
        return templatePath;
      }
    } catch (error) {
      // Continue to next path
    }
  }

  // If no path exists, return the most likely path for better error messages
  return possiblePaths[0];
};

// Render an EJS email template (HTML)
const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  const templatePath = getTemplatePath(templateName, 'ejs');
  return ejs.renderFile(templatePath, data);
};

// Render plain text email template
const renderTextTemplate = async (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  const templatePath = getTemplatePath(templateName, 'txt');
  return ejs.renderFile(templatePath, data);
};

// send an email using nodemailer with both HTML and plain text versions

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, any>
) => {
  try {
    const html = await renderEmailTemplate(templateName, data);
    const text = await renderTextTemplate(templateName, data);

    await transporter.sendMail({
      from: `Hamsoya <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });

    return true;
  } catch (error) {
    console.log('Error sending email', error);
    return false;
  }
};
