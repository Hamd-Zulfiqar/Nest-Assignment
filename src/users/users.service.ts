import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/User.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly UserModel: Model<UserDocument>){}

    async create(createUserDto: CreateUserDTO): Promise<User> {
        const createdUser = new this.UserModel(createUserDto);
        await createdUser.save();
        return createdUser;
      }
}
