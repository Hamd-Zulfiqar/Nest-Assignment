import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './schemas/Post.schema';
import { JwtStrategy } from '../common/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]), UsersModule],
    controllers: [PostsController],
    providers: [PostsService, JwtStrategy],
})
export class PostsModule {}
