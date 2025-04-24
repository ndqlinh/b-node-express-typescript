import TelegramBot from 'node-telegram-bot-api';
import { Logger } from '@shared/helpers/logger.helper';
import SsmHelper from '@shared/helpers/ssm.helper';
import { Stream } from 'stream';


export default class TelegramService {
  telegramBot: TelegramBot;
  ssmHelper: SsmHelper;

  constructor() {
    this.ssmHelper = new SsmHelper();
  }

  async initialize() {
    const telegramBotToken = await this.ssmHelper.getParams('TelegramBotToken');
    this.telegramBot = new TelegramBot(telegramBotToken);
  }

  async sendMessage(chatId: string, text: string) {
    try {
      if (!this.telegramBot) {
        await this.initialize();
      }
      await this.telegramBot.sendMessage(chatId, text);
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
