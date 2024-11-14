import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { UserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }
}
