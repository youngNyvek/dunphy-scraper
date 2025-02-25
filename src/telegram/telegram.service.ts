import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
private readonly telegramBot: TelegramBot;
private readonly chatId: string = process.env.CHAT_ID!; // Substitua pelo ID do chat ou grupo
private readonly telegramToken: string = process.env.TELEGRAM_KEY!; // Substitua pelo token do seu bot

constructor() {
  // Inicializa o bot do Telegram
  this.telegramBot = new TelegramBot(this.telegramToken, { polling: false });
}

/**
 * Envia uma mensagem para o Telegram.
 * @param message A mensagem que será enviada.
 */
async sendMessage(message: string): Promise<void> {
  try {
    await this.telegramBot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    console.log('[INFO] Mensagem enviada para o Telegram.');
  } catch (error) {
    console.error('[ERROR] Erro ao enviar mensagem para o Telegram:', error);
  }
}
}