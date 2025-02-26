import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ScrapingModule } from './scraping/scraping.module';
import { ConfiguracaoController } from './database/configuracao/configuracao.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ScrapingModule, ScheduleModule.forRoot(), ConfigModule.forRoot(), DatabaseModule],
  controllers: [AppController, ConfiguracaoController],
  providers: [AppService],
})
export class AppModule { }
