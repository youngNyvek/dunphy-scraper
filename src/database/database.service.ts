import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Imovel } from './imovel.schema';
import { Configuracao } from './configuracao/configuracao.schema';

@Injectable()
export class DatabaseService {
constructor(
  @InjectModel(Imovel.name) private readonly imovelModel: Model<Imovel>,
  @InjectModel(Configuracao.name) private readonly configuracaoModel: Model<Configuracao>,
) {}

// Métodos para lidar com imóveis
async isImovelExist(idCasa: string, siteProvedor: string): Promise<boolean> {
  const imovel = await this.imovelModel.findOne({ idCasa, siteProvedor }).exec();
  return !!imovel;
}

async saveImovel(idCasa: string, siteProvedor: string): Promise<void> {
  const novoImovel = new this.imovelModel({ idCasa, siteProvedor });
  await novoImovel.save();
}

// Métodos para lidar com configurações
async getValorConfiguracao(id: string): Promise<number> {
  const config = await this.configuracaoModel.findById(id).exec();
  return config?.valor || 0; // Retorna 0 se a configuração não existir
}

async setValorConfiguracao(id: string, valor: number): Promise<void> {
  await this.configuracaoModel.findByIdAndUpdate(
    id,
    { valor },
    { upsert: true, new: true }, // Cria o documento se ele não existir
  );
}
}