import { Controller, Get, Post, Put, Delete, Body, Logger, UsePipes, ValidationPipe, Param, UseInterceptors, Req, UseFilters, UseGuards } from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { UsersService } from 'src/users/users.service';
import { Post as Posts} from './schemas/Post.schema';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { UpdatePostDTO } from './dto/update-post.dto';
import { Request } from 'express';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe())
@UseFilters(HttpExceptionFilter)
export class PostsController {
    
  constructor(private readonly postService: PostsService, private readonly userService: UsersService){}

  @Get()
  @UseInterceptors(ResponseInterceptor)
  async findAll() {
    const posts = await this.postService.getAll();
    return {statusCode: 200, message: "Posts Retrieved!", data: posts};
  }

  @Get(':id')
  @UseInterceptors(ResponseInterceptor)
  async findOne(@Param('id') id) {
    const post = await this.postService.getOne(id);
    return {statusCode: 200, message: "Post found!", data: post};
  }

  @Post()
  @UseInterceptors(ResponseInterceptor)
  async createPost(@Body() post: CreatePostDTO, @Req() req: Request) {
    Logger.log("Adding a new Post!");
    const createdPost = await this.postService.create(post);
    
    await this.userService.addPost(req.user["userId"],createdPost._id);
    return {statusCode: 200, message: "Post Created!", data: createdPost};
  }

  @Put(':id')
  @UseInterceptors(ResponseInterceptor)
  async updatePost(@Param('id') id, @Body() post: UpdatePostDTO){
    Logger.log(`Updating Post with id: ${id}!`);
    const updatedPost = await this.postService.update(id, post);
    return {statusCode: 200, message: "Post Updated!", data: updatedPost};
  }

  @Delete(':id')
  @UseInterceptors(ResponseInterceptor)
  async deletePost(@Param('id') id){
    Logger.log(`Deleting Post with id: ${id}!`);
    const deletedPost = await this.postService.delete(id);
    return {statusCode: 200, message: "Post Deleted!", data: deletedPost};
  }
}
