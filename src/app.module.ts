import { Module } from '@nestjs/common';
import { ScrapingModule } from './scraping/scraping.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
imports: [ScrapingModule],
controllers: [AppController],
providers: [AppService],
})
export class AppModule {}