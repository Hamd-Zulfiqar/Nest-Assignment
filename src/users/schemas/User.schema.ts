import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { isEmail } from 'validator';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required: true})
  firstName: string;

  @Prop({required: true})
  lastName: string;

  @Prop({required: true, validate: isEmail})
  email: string;

  @Prop({required: true, minlength: 6, maxlength: 10})
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);