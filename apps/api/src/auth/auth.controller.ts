import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import type { AccessTokenPayload } from './jwt';

const MagicLinkSchema = z.object({
  email: z.string().email(),
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic-link')
  @HttpCode(204)
  async magicLink(@Body() body: unknown): Promise<void> {
    const { email } = MagicLinkSchema.parse(body);
    await this.authService.sendMagicLink(email);
  }

  @Get('callback')
  async callback(@Query('token') token?: string) {
    if (!token) {
      throw new BadRequestException('Missing token');
    }
    return this.authService.exchangeMagicLink(token);
  }
}

@Controller()
export class MeController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user?: AccessTokenPayload) {
    if (!user) {
      throw new UnauthorizedException('Missing user');
    }
    const record = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { id: true, email: true, role: true },
    });

    return record ?? { id: user.sub, email: null, role: user.role };
  }
}
