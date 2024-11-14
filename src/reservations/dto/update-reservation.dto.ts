import { PartialType } from '@nestjs/mapped-types';
import { ReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(ReservationDto) {}
