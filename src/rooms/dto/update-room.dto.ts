import { PartialType } from '@nestjs/mapped-types';
import { RoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(RoomDto) {}
