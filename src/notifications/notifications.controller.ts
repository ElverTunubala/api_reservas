import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { NotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  send(@Body() notificationDto: NotificationDto) {
    const { userId, type, message } = notificationDto;
    return this.notificationService.sendNotification(userId, type, message);
  }
}
