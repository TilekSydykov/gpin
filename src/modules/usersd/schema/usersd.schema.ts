import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersdDocument = Usersd & Document;

@Schema()
export class Usersd {
  @Prop()
  name: string;
  @Prop()
  password: string;
  @Prop()
  email: string;
}

export const UsersdSchema = SchemaFactory.createForClass(Usersd);
