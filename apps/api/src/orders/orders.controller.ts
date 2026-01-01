import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CreateOrderSchema } from '../common/zod-schemas';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() body: unknown) {
    const parsed = CreateOrderSchema.parse(body);
    const job = await this.ordersService.createOrder({
      ...parsed,
      pickupTs: new Date(parsed.pickupTs),
      deliveryTs: new Date(parsed.deliveryTs),
    });
    return { id: job.id, status: job.status };
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const job = await this.ordersService.getOrder(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }
}
