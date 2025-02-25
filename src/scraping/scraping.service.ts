import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapingService {
async scrapeWebsite(url: string): Promise<any> {
  console.log(`[INFO] Iniciando o processo de scraping para a URL: ${url}`);

  try {
    // Inicializa o navegador com o Puppeteer padrão
    console.log('[INFO] Inicializando o navegador...');
    const browser = await puppeteer.launch({
      headless: true, // Executa no modo headless
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Flags necessárias para evitar erros de permissão
    });

    console.log('[INFO] Criando uma nova página no navegador...');
    const page = await browser.newPage();

    // Navega até a URL fornecida
    console.log(`[INFO] Navegando para a URL: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    const returnedHtml = await page.content();
    console.log(`[INFO] HTML retornado: ${returnedHtml}`);

    // Aguarda que a div com a classe "row imoveis" esteja presente no DOM
    console.log('[INFO] Aguardando o seletor ".row.imoveis" aparecer na página...');
    await page.waitForSelector('.row.imoveis');

    // Extrai as informações diretamente do DOM usando page.evaluate()
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

          // Extrair características (metragem, quartos, vagas, banheiros)
          const area = parseInt(article.querySelector('.caracteristica.area')?.textContent?.trim() || '0');
          const quartos = parseInt(article.querySelector('.caracteristica.quartos')?.textContent?.trim() || '0');
          const vagas = parseInt(article.querySelector('.caracteristica.vagas')?.textContent?.trim() || '0');
          const banheiros = article.querySelector('.caracteristica.banheiros')?.textContent?.trim() || '';

          // Extrair valor
          const valorTexto =
            article.querySelector('.imovel-valor .valor')?.textContent?.replace(/[^\d]/g, '') || '0';
          const valor = parseFloat(valorTexto) || 0;

          // Calcular preço por metro quadrado
          const precoPorMetroQuadrado = area > 0 ? (valor / area).toFixed(2) : 'N/A';

          // Retornar os dados extraídos como um objeto
          return {
            id,
            titulo,
            endereco,
            area,
            quartos,
            vagas,
            banheiros,
            valor,
            precoPorMetroQuadrado,
          };
        })
        .filter(Boolean); // Remove itens nulos
    });

    console.log(`[INFO] Extração concluída. Total de imóveis encontrados: ${imoveis.length}`);

    // Fecha o navegador
    console.log('[INFO] Fechando o navegador...');
    await browser.close();

    console.log('[INFO] Processo de scraping concluído com sucesso.');
    return imoveis;
  } catch (error) {
    console.error('[ERROR] Erro ao realizar o scraping:', error);

    // Retorna uma mensagem de erro específica dependendo do tipo de problema
    if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      throw new Error('Erro: O domínio fornecido não pôde ser resolvido. Verifique a URL.');
    } else if (error.message.includes('Timeout')) {
      throw new Error('Erro: Tempo limite excedido ao tentar acessar a página ou aguardar elementos.');
    } else if (error.message.includes('No node found for selector')) {
      throw new Error('Erro: O seletor esperado não foi encontrado na página. Verifique a estrutura do site.');
    } else {
      throw new Error(`Erro inesperado durante o scraping: ${error.message}`);
    }
  }
}
}
