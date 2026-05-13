import nodemailer from 'nodemailer';

const DEFAULT_FROM = process.env.SMTP_FROM || process.env.MAIL_FROM || 'CoinPremier <no-reply@coinpremier.local>';

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST);
}

function createTransporter() {
  if (!hasSmtpConfig()) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

export function renderTemplate(html, variables = {}) {
  return Object.entries(variables).reduce(
    (content, [key, value]) => content.replaceAll(`{{${key}}}`, String(value ?? '')),
    html
  );
}

const EmailService = {
  async send({ to, subject, html, text }) {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    });

    return {
      ok: true,
      delivered: hasSmtpConfig(),
      messageId: info.messageId,
      preview: hasSmtpConfig() ? undefined : info.message?.toString(),
    };
  },

  async sendTemplate({ to, template, variables = {} }) {
    const html = renderTemplate(template.html, variables);
    return this.send({
      to,
      subject: renderTemplate(template.assunto, variables),
      html,
    });
  },
};

export default EmailService;
