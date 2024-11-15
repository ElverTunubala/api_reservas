import { Module } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { RoomController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Room } from './entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Room])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomsModule {}
