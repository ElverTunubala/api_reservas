import { IsNotEmpty, IsInt, IsDateString, IsString, Length, IsEnum } from 'class-validator';
import { ReservationStatus } from '../enum/reservatio.enum'

export class ReservationDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @IsNotEmpty()
  @IsDateString()
  reservationDate: Date;

  @IsNotEmpty()
  @IsString()
  @Length(5, 5) // Validates time format like "09:45"
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 5) // Validates time format like "11:45"
  endTime: string;

  @IsNotEmpty()
  @IsEnum(ReservationStatus) 
  status: ReservationStatus;
}
