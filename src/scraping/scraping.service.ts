import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

@Injectable()
export class ScrapingService {
async scrapeWebsite(url: string): Promise<any> {
  let browser: Browser | undefined = undefined;

  try {
    // Inicializa o navegador com o Puppeteer padrão
    browser = await puppeteer.launch({
      headless: true, // Executa no modo headless
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Flags necessárias para evitar erros de permissão,
    });

    const page = await browser.newPage();

    // Navega até a URL fornecida
    await page.goto(url, { waitUntil: "networkidle2" });

    // Aguarda que a div com a classe "row imoveis" esteja presente no DOM
    await page.waitForSelector(".row.imoveis");

    // Extrai as informações diretamente do DOM usando page.evaluate()
    const imoveis = await page.evaluate(() => {
      const rowImoveis = document.querySelector(".row.imoveis");
      if (!rowImoveis) return [];

      const divFilhos = Array.from(rowImoveis.querySelectorAll("div.col-12")).filter((element) =>
        element.querySelector("article.card-imovel")
      );

      return divFilhos.map((element) => {
        const article = element.querySelector("article.card-imovel");

        if (!article) return null;

        // Extrair ID do imóvel
        const id = article.getAttribute("id") || "";

        // Extrair título e endereço
        const titulo = article.querySelector(".imovel-title h2")?.textContent?.trim() || "";
        const endereco = article.querySelector(".imovel-title .endereco")?.textContent?.trim() || "";

        // Extrair características (metragem, quartos, vagas, banheiros)
        const area = parseInt(article.querySelector(".caracteristica.area")?.textContent?.trim() || "0");
        const quartos = parseInt(article.querySelector(".caracteristica.quartos")?.textContent?.trim() || "0");
        const vagas = parseInt(article.querySelector(".caracteristica.vagas")?.textContent?.trim() || "0");
        const banheiros = article.querySelector(".caracteristica.banheiros")?.textContent?.trim() || "";

        // Extrair valor
        const valorTexto = article.querySelector(".imovel-valor .valor")?.textContent?.replace(/[^\d]/g, "") || "0";
        const valor = parseFloat(valorTexto) || 0;

        // Calcular preço por metro quadrado
        const precoPorMetroQuadrado = area > 0 ? (valor / area).toFixed(2) : "N/A";

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
      }).filter(Boolean); // Remove itens nulos
    });

    // Fecha o navegador
    return imoveis;
  } catch (error) {
    console.error("Erro ao realizar o scraping:", error);
    throw new Error(`Erro ao realizar o scraping: ${error.message}`);
  } finally {
    if(browser) await browser.close();
  }
}
}
