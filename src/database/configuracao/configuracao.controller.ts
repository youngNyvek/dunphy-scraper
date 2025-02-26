import { Controller, Get, Post, Body } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Controller('configuracao')
export class ConfiguracaoController {
constructor(private readonly databaseService: DatabaseService) {}

// Rota para obter o valor atual da configuração
@Get('valor')
async getValor(): Promise<{ id: string; valor: number }> {
  const valor = await this.databaseService.getValorConfiguracao('preco-alvo');
  return { id: 'preco-alvo', valor };
}

// Rota para definir o valor da configuração
@Post('valor')
async setValor(@Body() body: { valor: number }): Promise<{ message: string }> {
  const { valor } = body;

  if (!valor || typeof valor !== 'number') {
    return { message: 'O campo "valor" é obrigatório e deve ser um número.' };
  }

  await this.databaseService.setValorConfiguracao('preco-alvo', valor);
  return { message: `Valor atualizado para R$${valor}` };
}
}