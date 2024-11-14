import { IsNotEmpty, IsEmail, IsOptional, IsBoolean, Length } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @IsOptional()
  @Length(0, 15)
  phone?: string;
}
