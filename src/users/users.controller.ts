import { Controller, Get, Post, Put, Delete, Body, Logger, UsePipes, ValidationPipe, Param, UseInterceptors, UseFilters, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/User.schema';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { UpdateUserDTO } from './dto/update-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('users')
@UsePipes(new ValidationPipe())
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UsersService, private jwtService: JwtService){}

  @Get()
  @UseInterceptors(ResponseInterceptor)
  async findAll() {
    const users = await this.userService.getAll();
    return {statusCode: 200, message: "Users Retrieved!", data: users};
  }

  @Get(':id')
  @UseInterceptors(ResponseInterceptor)
  async findOne(@Param('id') id) {
    const user = await this.userService.getOne(id);
    return {statusCode: 200, message: "User found!", data: user};
  }

  @Post('signup')
  @UseInterceptors(ResponseInterceptor)
  async createUser(@Body() user: CreateUserDTO) {
    Logger.log("Adding a new User!");
    const createdUser = await this.userService.create(user);
    return {statusCode: 200, message: "User Created!", data: createdUser};
  }

  @Post('login')
  @UseInterceptors(ResponseInterceptor)
  async loginUser(@Body() user: LoginUserDTO) {
    Logger.log("Loggin in a User!");
    const loggedinUser = await this.userService.login(user);
    console.log(loggedinUser);

    //Token Generation will take place later here!!!
    const token = await this.jwtService.signAsync({id: loggedinUser._id});
    console.log(token);
    
    return {statusCode: 200, message: "User Logged in!", data: {token}};
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ResponseInterceptor)
  async updateUser(@Param('id') id, @Body() user: UpdateUserDTO){
    Logger.log(`Updating User with id: ${id}!`);
    const updatedUser = await this.userService.update(id, user);
    return {statusCode: 200, message: "User Updated!", data: updatedUser};
  }

  @Delete(':id')
  @UseInterceptors(ResponseInterceptor)
  async deleteUser(@Param('id') id){
    Logger.log(`Deleting User with id: ${id}!`);
    const deletedUser = await this.userService.delete(id);
    return {statusCode: 200, message: "User Deleted!", data: deletedUser};
  }
}
