import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop()
  userId: string;

  @Prop()
  contactId: string;

  @Prop({ default: false })
  status: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
