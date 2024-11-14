import { Global, Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
