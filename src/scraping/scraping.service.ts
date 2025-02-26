import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Cron } from '@nestjs/schedule';
import { TelegramService } from '../telegram/telegram.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ScrapingService {
constructor(
  private readonly telegramService: TelegramService,
  private readonly databaseService: DatabaseService,
) {}

async onModuleInit(): Promise<void> {
  console.log('[INFO] Executando o scraping imediatamente após a inicialização...');
  await this.scrapeAndNotify();
}

@Cron('*/30 * * * *') // Executa a cada 30 minutos
async scrapeAndNotify(): Promise<void> {
  const url = process.env.URL!;
  console.log(`[INFO] Iniciando o scraping para a URL: ${url}`);

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const imoveis = await page.evaluate(() => {
      const rowImoveis = document.querySelector('.row.imoveis');
      if (!rowImoveis) return [];

      const divFilhos = Array.from(rowImoveis.querySelectorAll('div.col-12')).filter((element) =>
        element.querySelector('article.card-imovel'),
      );

      return divFilhos.map((element) => {
        const article = element.querySelector('article.card-imovel');
        if (!article) return null;

        const id = article.getAttribute('id') || '';
        const titulo = article.querySelector('.imovel-title h2')?.textContent?.trim() || '';
        const endereco = article.querySelector('.imovel-title .endereco')?.textContent?.trim() || '';
        const valorTexto =
          article.querySelector('.imovel-valor .valor')?.textContent?.replace(/[^\d]/g, '') || '0';
        const valor = parseFloat(valorTexto) || 0;

        return { id, titulo, endereco, valor };
      }).filter(imovel => !!imovel);
    });

    const precoAlvo = await this.databaseService.getValorConfiguracao('preco-alvo');
    console.log(`[INFO] Preço alvo configurado: R$${precoAlvo}`);

    for (const imovel of imoveis) {
      const { id, titulo, endereco, valor } = imovel;

      const existe = await this.databaseService.isImovelExist(id, 'netimoveis');
      if (existe) {
        console.log(`[INFO] Imóvel ${id} já foi enviado anteriormente.`);
        continue;
      }

      if (valor > precoAlvo) {
        console.log(`[INFO] Imóvel ${id} excede o preço alvo.`);
        continue;
      }

      // Envia a mensagem para o Telegram
      const mensagem = `
    🏠 *Novo Imóvel Disponível!*
    📍 *Título:* ${titulo}
    📍 *Endereço:* ${endereco}
    💰 *Valor:* R$${valor.toFixed(2)}
    🔗 *Link:* ${url}
          `;
      await this.telegramService.sendMessage(mensagem);

      // Salva o imóvel no banco
      await this.databaseService.saveImovel(id, 'netimoveis');
    }

    await browser.close();
  } catch (error) {
    console.error('[ERROR] Erro ao realizar o scraping:', error);
  }
}
}