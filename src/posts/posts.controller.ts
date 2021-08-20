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
import { ApiTags, ApiHeader, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('posts')
@ApiTags('Posts')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer Token',
})
@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe())
@UseFilters(HttpExceptionFilter)
export class PostsController {
    
  constructor(private readonly postService: PostsService, private readonly userService: UsersService){}

  @Get()
  @ApiOkResponse({description: "Posts Retrieved!"})
  @UseInterceptors(ResponseInterceptor)
  async findAll( @Req() req: Request) {
    const user = await this.userService.getDocument(req.user["userId"]);
    const posts = await this.postService.getAll(user);
    return {statusCode: 200, message: "Posts Retrieved!", data: posts};
  }

  @Get('feed')
  @ApiOkResponse({description: "Feed Generated!"})
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ResponseInterceptor)
  async getFeed(@Param('sort') sort, @Req() req: Request){
    const postIds = await this.userService.getPosts(req.user["userId"]);
    const feed = await this.postService.getFeed(postIds, sort);
    console.log(feed);
    return {status: 200, message: "Feed generated!", data: feed};
  }

  @Get(':id')
  @ApiOkResponse({description: "Post Retrieved!"})
  @ApiNotFoundResponse({description: "Post not found!"})
  @UseInterceptors(ResponseInterceptor)
  async findOne(@Param('id') id) {
    const post = await this.postService.getOne(id);
    return {statusCode: 200, message: "Post found!", data: post};
  }

  @Post()
  @ApiOkResponse({description: "Posts Created!"})
  @UseInterceptors(ResponseInterceptor)
  async createPost(@Body() post: CreatePostDTO, @Req() req: Request) {
    Logger.log("Adding a new Post!");
    const createdPost = await this.postService.create(post);
    
    await this.userService.addPost(req.user["userId"],createdPost._id);
    return {statusCode: 201, message: "Post Created!", data: createdPost};
  }

  @Put(':id')
  @ApiOkResponse({description: "Post Updated!"})
  @UseInterceptors(ResponseInterceptor)
  async updatePost(@Param('id') id, @Body() post: UpdatePostDTO){
    Logger.log(`Updating Post with id: ${id}!`);
    const updatedPost = await this.postService.update(id, post);
    return {statusCode: 200, message: "Post Updated!", data: updatedPost};
  }

  @Delete(':id')
  @ApiOkResponse({description: "Posts Deleted!"})
  @UseInterceptors(ResponseInterceptor)
  async deletePost(@Param('id') id, @Req() req: Request){
    Logger.log(`Deleting Post with id: ${id}!`);
    const deletedPost = await this.postService.delete(id);
    
    await this.userService.removePost(req.user["userId"], deletedPost._id);
    return {statusCode: 200, message: "Post Deleted!", data: deletedPost};
  }
}
