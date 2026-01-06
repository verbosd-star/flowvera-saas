import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async create(@Request() req: any, @Body() createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionsService.create(req.user.userId, createSubscriptionDto);
    return {
      message: 'Subscription created successfully',
      subscription,
    };
  }

  @Get()
  async getCurrent(@Request() req: any) {
    return this.subscriptionsService.getSubscriptionInfo(req.user.userId);
  }

  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getAllPlans();
  }

  @Put()
  async update(@Request() req: any, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionsService.update(req.user.userId, updateSubscriptionDto);
    return {
      message: 'Subscription updated successfully',
      subscription,
    };
  }

  @Post('cancel')
  async cancel(@Request() req: any) {
    const subscription = await this.subscriptionsService.cancel(req.user.userId);
    return {
      message: 'Subscription cancelled successfully',
      subscription,
    };
  }
}
