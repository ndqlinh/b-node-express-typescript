import TelegramBot from 'node-telegram-bot-api';
import { Logger } from '@shared/helpers/logger.helper';
import { Stream } from 'stream';

export default class TelegramService {
  telegramBot: TelegramBot;
  userStates = {};
  formSteps = {
    started: 'urls',
    listSelector: 'listSelector',
    contentSelector: 'contentSelector',
  };

  constructor() {}

  initialize() {
    this.telegramBot = new TelegramBot(process.env.TELEGRAM_BOX_TOKEN);
    return this.telegramBot;
  }

  async sendMessage(chatId: string, text: string, options: any = {}) {
    try {
      if (!this.telegramBot) {
        await this.initialize();
      }
      await this.telegramBot.sendMessage(chatId, text, options);
      Logger.INFO('Message sent successfully!', chatId);
    } catch (error) {
      Logger.ERROR('Error sending message:', error);
    }
  }

  async sendDocument(chatId: string, document: string | Buffer | Stream) {
    try {
      if (!this.telegramBot) {
        await this.initialize();
      }

      await this.telegramBot.sendDocument(chatId, document);
      Logger.INFO('Document sent successfully!', chatId);
    } catch (error) {
      Logger.ERROR('Error sending document:', error);
    }
  }
}
