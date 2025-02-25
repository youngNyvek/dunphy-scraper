import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Cron } from '@nestjs/schedule';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class ScrapingService {
constructor(private readonly telegramService: TelegramService) {}

async onModuleInit(): Promise<void> {
  console.log('[INFO] Executando o scraping imediatamente após a inicialização...');
  await this.scrapeAndNotify();
}

@Cron('*/30 * * * *') // Executa a cada 30 minutos
async scrapeAndNotify(): Promise<void> {
  const url = process.env.URL!; // Substitua pela URL que deseja acessar
  console.log(`[INFO] Iniciando o scraping para a URL: ${url}`);

  try {
    console.log('[INFO] Inicializando o navegador...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Define um User-Agent realista
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    console.log(`[INFO] Navegando para a URL: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('[INFO] Extraindo informações da página...');
    const imoveis = await page.evaluate(() => {
      const rowImoveis = document.querySelector('.row.imoveis');
      if (!rowImoveis) return [];

      const divFilhos = Array.from(rowImoveis.querySelectorAll('div.col-12')).filter((element) =>
        element.querySelector('article.card-imovel'),
      );

      return divFilhos
        .map((element) => {
          const article = element.querySelector('article.card-imovel');

          if (!article) return null;

          // Extrair ID do imóvel
          const id = article.getAttribute('id') || '';

          // Extrair título e endereço
          const titulo = article.querySelector('.imovel-title h2')?.textContent?.trim() || '';
          const endereco = article.querySelector('.imovel-title .endereco')?.textContent?.trim() || '';

          // Extrair valor
          const valorTexto =
            article.querySelector('.imovel-valor .valor')?.textContent?.replace(/[^\d]/g, '') || '0';
          const valor = parseFloat(valorTexto) || 0;

          // Extrair link direto do imóvel
          const linkElement = document.querySelector(`[id='${id}-link-imovel']`);
          const link = linkElement ? 'netimoveis.com' + linkElement.getAttribute('href') : '';


          // Retornar os dados extraídos como um objeto
          return {
            id,
            titulo,
            endereco,
            valor,
            link,
          };
        })
        .filter(element => element != null);
    });

    console.log(`[INFO] Total de imóveis encontrados: ${imoveis.length}`);

    // Filtrar imóveis com aluguel até R$1500
    const imoveisFiltrados = imoveis.filter((imovel) => imovel.valor <= 3000);

    if (imoveisFiltrados.length > 0) {
      console.log(`[INFO] Encontrados ${imoveisFiltrados.length} imóveis com aluguel até R$1500.`);
      for (const imovel of imoveisFiltrados) {
        const mensagem = `
        🏠 *Novo Imóvel Disponível!*
        📍 *Título:* ${imovel.titulo}
        📍 *Endereço:* ${imovel.endereco}
        💰 *Valor:* R$${imovel.valor.toFixed(2)}
        🔗 *Link:* [Clique aqui](${imovel.link})
        `;
        await this.telegramService.sendMessage(mensagem);
      }
    } else {
      console.log('[INFO] Nenhum imóvel encontrado com aluguel até R$1500.');
    }

    console.log('[INFO] Fechando o navegador...');
    await browser.close();
  } catch (error) {
    console.error('[ERROR] Erro ao realizar o scraping:', error);
  }
}
}
