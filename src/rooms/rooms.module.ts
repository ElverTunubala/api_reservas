import { Module } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
  controllers: [RoomsController],
  providers: [RoomService],
})
export class RoomsModule {}
