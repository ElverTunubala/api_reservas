import { IsNotEmpty, IsInt, IsDateString, IsString, Length, IsEnum } from 'class-validator';
import { ReservationStatus } from '../enum/reservatio.enum'

export class ReservationDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  @IsDateString()
  reservationDate: Date;

  @IsNotEmpty()
  @IsDateString()  
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()  
  endTime: Date;

  @IsNotEmpty()
  @IsEnum(ReservationStatus) 
  status: ReservationStatus;
}
