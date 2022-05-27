/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class User extends Document {
  @Prop()
  userName: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
  
  @Prop()
  email: string;

  @Prop()
  password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
