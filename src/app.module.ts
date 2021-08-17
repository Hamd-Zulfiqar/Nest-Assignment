import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import config from '../config/keys'

@Module({
  imports: [UsersModule, MongooseModule.forRoot(config.mongoURL), PostsModule],
  controllers: [AppController,],
  providers: [AppService,],
})
export class AppModule {}
