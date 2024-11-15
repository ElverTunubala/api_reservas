import { Controller, Post, Body } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { RoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() roomDto: RoomDto) {
    return this.roomService.createRoom(roomDto);
  }
}
