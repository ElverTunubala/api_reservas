import { IsNotEmpty, IsInt, IsDateString, Length } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  reservationId: number;

  @IsNotEmpty()
  @Length(1, 50)
  type: string;

  @IsNotEmpty()
  @IsDateString()
  sentDate: Date;

  @IsNotEmpty()
  @Length(1, 1000)
  message: string;
}
