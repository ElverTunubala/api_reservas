import { IsNotEmpty, IsBoolean, Length, IsInt, Min } from 'class-validator';

export class RoomDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @Length(1, 20)
  number: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  capacity: number;

  @IsNotEmpty()
  @IsBoolean()
  available: boolean;
}
