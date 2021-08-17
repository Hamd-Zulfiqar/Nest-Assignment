import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/Post.schema';
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

    async getAll(): Promise<Post[]> {
        return await this.PostModel.find();
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
  
      async delete(id: string) {
        return await this.PostModel.findOneAndDelete({_id: id});
      }
}
