import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { ReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() reservationDto: ReservationDto) {
    return this.reservationService.createReservation(reservationDto);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.reservationService.cancelReservation(id);
  }
}
