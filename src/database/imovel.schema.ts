import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Imovel extends Document {
  @Prop({ required: true })
  idCasa: string;

  @Prop({ required: true })
  siteProvedor: string;
}

export const ImovelSchema = SchemaFactory.createForClass(Imovel);