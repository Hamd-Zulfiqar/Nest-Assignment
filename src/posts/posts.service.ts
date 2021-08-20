import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/Post.schema';
import { User, UserDocument } from '../users/schemas/User.schema';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
    constructor(@InjectModel('Post') private readonly PostModel: Model<PostDocument>){}

    async create(createPostDto: CreatePostDTO): Promise<PostDocument> {
        const post = await this.PostModel.create(createPostDto);
        return post;
    }

    async getAll(user: UserDocument): Promise<Post[]> {
        return await this.PostModel.find({ '_id': { $in: user.posts } });
    }

    async getOne(id: string): Promise<Post> {
        const post = await this.PostModel.findOne({_id: id});

        if(!post)
            throw new BadRequestException("Post not found!");
        
        return post;
    }

    async update(id: string, updatePostDto: UpdatePostDTO): Promise<Post> {
      return await this.PostModel.findOneAndUpdate({_id: id}, updatePostDto, {new: true});
    }
  
    async delete(id: string): Promise<PostDocument> {
      return await this.PostModel.findOneAndDelete({_id: id});
    }

    async getFeed(posts: Array<string>, sort: string = 'desc'): Promise<Post[]> {
      console.log(posts);
      return await this.PostModel.find({ '_id': { $in: posts } }).sort({ createdAt: sort});
    }
}
