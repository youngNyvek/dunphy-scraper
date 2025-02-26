import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Configuracao extends Document {
@Prop({ required: true })
declare _id: string; // Identificador único (ex.: "preco-alvo")

@Prop({ required: true })
valor: number; // Valor associado à configuração (ex.: preço desejado)

@Prop()
siteProvedor?: string; // Site associado à configuração (opcional)
}

export const ConfiguracaoSchema = SchemaFactory.createForClass(Configuracao);