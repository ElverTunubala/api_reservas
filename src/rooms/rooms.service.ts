import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) throw new BadRequestException('Room not found');
    return room;
  }

  async createRoom(roomDto: RoomDto): Promise<Room> {
    const room = this.roomRepository.create(roomDto);
    return this.roomRepository.save(room);
  }
}
