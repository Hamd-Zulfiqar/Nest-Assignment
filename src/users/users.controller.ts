import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/User.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService){}

  @Get()
  findAll(): string {
    return 'All Users';
  }

  @Post()
  createUser(@Body() user: CreateUserDTO): Promise<User> {
    const createdUser =  this.userService.create(user);

    return createdUser;
  }
}
