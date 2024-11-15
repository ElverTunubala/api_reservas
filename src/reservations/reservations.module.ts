import { Global, Module } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { ReservationController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { RoomService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/entities/room.entity';
import { NotificationService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Room, Notification])],
  controllers: [ReservationController],
  providers: [ReservationService, RoomService, NotificationService],
})
export class ReservationsModule {}
