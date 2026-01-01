import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { issueAccessToken, issueMagicLinkToken, verifyMagicLinkToken } from './jwt';

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new InternalServerErrorException(`${name} is required`);
  }
  return value;
};

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMagicLink(email: string): Promise<void> {
    const baseUrl = requireEnv('PUBLIC_BASE_URL').replace(/\/$/, '');
    const magicToken = issueMagicLinkToken(email);
    const url = `${baseUrl}/v1/auth/callback?token=${encodeURIComponent(magicToken)}`;

    const smtpUrl = process.env.MAGICLINK_SMTP_URL;
    if (!smtpUrl) {
      console.log(`[DEV] Magic link for ${email}: ${url}`);
      return;
    }

    const from = requireEnv('MAGICLINK_FROM');
    const transporter = nodemailer.createTransport(smtpUrl);
    await transporter.sendMail({
      from,
      to: email,
      subject: 'Your ParcelEvo magic link',
      text: `Sign in: ${url}`,
      html: `<p>Sign in: <a href="${url}">${url}</a></p>`,
    });
  }

  async exchangeMagicLink(token: string) {
    let email: string;
    try {
      const payload = verifyMagicLinkToken(token);
      email = payload.email.toLowerCase();
    } catch {
      throw new UnauthorizedException('Invalid or expired magic link');
    }

    const seedOpsEmail = process.env.SEED_OPS_EMAIL?.toLowerCase();
    const defaultRole = seedOpsEmail && email === seedOpsEmail ? 'ops' : 'customer';

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        role: defaultRole,
      },
    });

    const tokenPayload = { sub: user.id, role: user.role };
    return {
      token: issueAccessToken(tokenPayload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
