import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import validator from 'validator';
import * as mongoose from 'mongoose';
import { Post } from 'src/posts/schemas/Post.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required: true})
  firstName: string;

  @Prop({required: true})
  lastName: string;

  @Prop({required: true, validate: validator.isEmail})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  posts: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);