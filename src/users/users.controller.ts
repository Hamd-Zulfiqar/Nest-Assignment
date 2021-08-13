import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Get()
  findAll(): string {
    return 'All Users';
  }

  @Post()
  createUser(@Body() user: CreateUserDTO): string {
    return `created the user with email: ${user.email} and password: ${user.password}`;
  }
}
