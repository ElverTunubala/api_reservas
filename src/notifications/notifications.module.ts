import { Module } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { NotificationController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../notifications/entities/notification.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationsModule {}
