import { Body, Controller, Get, HttpCode, NotFoundException, Param, Post } from '@nestjs/common';
import { CreateOfferSchema } from '../common/zod-schemas';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async createOffer(@Body() body: unknown) {
    const parsed = CreateOfferSchema.parse(body);
    const offer = await this.offersService.createOffer(parsed);
    return { id: offer.id, status: offer.status, expiresAt: offer.expiresAt };
  }

  @Post(':id/accept')
  @HttpCode(200)
  async acceptOffer(@Param('id') id: string) {
    await this.offersService.acceptOffer(id);
    return { status: 'accepted' };
  }

  @Get(':id')
  async getOffer(@Param('id') id: string) {
    const offer = await this.offersService.getOffer(id);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }
}
