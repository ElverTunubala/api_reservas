import { IsNotEmpty, IsInt, IsDateString, Length } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  reservationId: string;

  @IsNotEmpty()
  @Length(1, 100)
  type: string;

  @IsNotEmpty()
  @IsDateString()
  sentDate: Date;

  @IsNotEmpty()
  @Length(1, 1000)
  message: string;
}
