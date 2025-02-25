import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapingService } from './scraping/scraping.service';
import { TelegramService } from './telegram/telegram.service';
import { ConfigModule } from '@nestjs/config';

@Module({
imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
controllers: [AppController],
providers: [AppService, ScrapingService, TelegramService],
})
export class AppModule {}

