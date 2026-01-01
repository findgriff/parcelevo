import nodemailer, { type Transporter } from 'nodemailer';

type SendArgs = { to: string; subject: string; text: string; html?: string };

export class EmailChannel {
  private transporter?: Transporter;

  constructor() {
    const url = process.env.MAGICLINK_SMTP_URL;
    if (url) {
      this.transporter = nodemailer.createTransport(url);
    }
  }

  async send({ to, subject, text, html }: SendArgs): Promise<void> {
    const from =
      process.env.NOTIFY_EMAIL_FROM ||
      process.env.MAGICLINK_FROM ||
      'no-reply@parcelevo.com';

    if (!this.transporter) {
      console.log(
        `[DEV][email]\nfrom=${from}\nto=${to}\nsubject=${subject}\ntext=${text}${
          html ? `\nhtml=${html}` : ''
        }`
      );
      return;
    }

    await this.transporter.sendMail({ from, to, subject, text, html });
  }
}
