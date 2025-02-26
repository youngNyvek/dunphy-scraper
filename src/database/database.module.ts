import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { Imovel, ImovelSchema } from './imovel.schema';
import { Configuracao, ConfiguracaoSchema } from './configuracao/configuracao.schema';
import { ConfiguracaoController } from './configuracao/configuracao.controller';

@Module({
imports: [
  MongooseModule.forFeature([
    { name: Imovel.name, schema: ImovelSchema },
    { name: Configuracao.name, schema: ConfiguracaoSchema },
  ]),
],
controllers: [ConfiguracaoController], // Registra o controlador
providers: [DatabaseService],
exports: [DatabaseService],
})
export class DatabaseModule {}