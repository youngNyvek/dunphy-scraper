import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { DatabaseModule } from 'src/database/database.module';
import { TelegramService } from 'src/telegram/telegram.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [DatabaseModule, MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/imoveisdb')], 
  providers: [ScrapingService, TelegramService]
})
export class ScrapingModule {}
