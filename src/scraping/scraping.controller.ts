import { Controller, Post, Body } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
constructor(private readonly scrapingService: ScrapingService) {}

@Post()
async scrape(@Body('url') url: string): Promise<{ title: string }> {
  const title = await this.scrapingService.scrapeWebsite(url);
  return { title };
}
}
