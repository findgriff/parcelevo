import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { DriverAvailabilitySchema } from '../common/zod-schemas';
import { DriversService } from './drivers.service';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post(':id/availability')
  @HttpCode(204)
  async setAvailability(@Param('id') id: string, @Body() body: unknown): Promise<void> {
    const parsed = DriverAvailabilitySchema.parse(body);
    await this.driversService.setAvailability(id, parsed.state);
  }
}
