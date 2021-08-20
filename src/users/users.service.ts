import { Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/User.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import * as bcrypt from "bcrypt";
import { Model } from 'mongoose';
import * as Error from '../common/ErrorHandler';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly UserModel: Model<UserDocument>){}

    async create(createUserDto: CreateUserDTO): Promise<User> {
      try {
        const emailExists = await this.UserModel.countDocuments({email: createUserDto.email});
        if (emailExists)
          Error.http400("Email already exists!");
  
        createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
        return await this.UserModel.create(createUserDto);
      } catch (error) {
          Error.http500(error.message);
      }
    }

    async login(loginUserDto: LoginUserDTO): Promise<UserDocument> {
      try {
        const user = await this.UserModel.findOne({
          email: loginUserDto.email,
        });
        if (user && await bcrypt.compare(loginUserDto.password,user.password))
          return await user;
        
        Error.http400("Invalid Credentials!");
      } catch (error) {
        Error.http500(error.message);
      }
    }
    
    async getAll(page: number = 1): Promise<User[]> {

      return await this.UserModel.find().limit(10).skip((page - 1) * 10);
    }

    async getOne(id: string): Promise<User> {
      const user = await this.UserModel.findOne({ _id: id}).populate("posts").populate("following");

      if(!user)
        Error.http404("User Not found!");
      
      return user;
    }

    async update(id: string, updateUserDto: UpdateUserDTO): Promise<User> {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
      return await this.UserModel.findOneAndUpdate({_id: id}, updateUserDto, {new: true});
    }

    async delete(id: string) {
      return await this.UserModel.findOneAndDelete({_id: id});
    }

    async addPost(userId: string, postId: string) {
      await this.UserModel.updateOne({ _id: userId}, { $push: { posts: postId}});
    }

    async removePost(userId: string, postId: string) {
      await this.UserModel.updateOne({ _id: userId}, { $pull: {posts: postId}});
    }

    async getDocument(id: string): Promise<UserDocument> {
      const user = await this.UserModel.findOne({ _id: id});

      if(!user)
        Error.http404("User Not found!");
      
      return user;
    }

    async followUser(currentUser: string, id: string) {
      const user = await this.UserModel.findOne({_id: id});

      if(user)
        await this.UserModel.updateOne({_id: currentUser}, { $push: {following: id}});
      else
        Error.http404("User Not found!");
    }

    async unfollowUser(currentUser: string, id: string) {
      const user = await this.UserModel.findOne({_id: id});

      if(user)
        await this.UserModel.updateOne({_id: currentUser}, { $pull: {following: id}});
      else
        Error.http404("User Not found!");
    }

    async getPosts(id: string) {
      const user = await this.UserModel.findOne({ _id: id}).populate("following");
      let feed = [];

      const followings = user.following;

      followings.forEach(user => {
        feed = feed.concat(user.posts);
      })
      return feed;
    }

}
