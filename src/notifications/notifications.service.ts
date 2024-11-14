import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationDto } from './dto/create-notification.dto';
import { Server } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
@Injectable()
export class NotificationService {
  @WebSocketServer()
  private server: Server;

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async sendNotification(userId: string, type: string, message: string) {
    const notification = this.notificationRepository.create({
      user: { id: userId },
      type,
      sentDate: new Date(),
      message,
    });
    await this.notificationRepository.save(notification);

    // Emitir notificación a través de WebSocket
    this.server.emit('notification', { userId, type, message });
  }
}
