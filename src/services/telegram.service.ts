import TelegramBot from 'node-telegram-bot-api';
import { Logger } from '@shared/helpers/logger.helper';
import SsmHelper from '@shared/helpers/ssm.helper';
import { Stream } from 'stream';

export default class TelegramService {
  telegramBot: TelegramBot;
  ssmHelper: SsmHelper;
  userStates = {};
  formSteps = {
    started: 'urls',
    listSelector: 'listSelector',
    contentSelector: 'contentSelector',
  };

  constructor() {
    this.ssmHelper = new SsmHelper();
  }

  async initialize() {
    const telegramBotToken = await this.ssmHelper.getParams('TelegramBotToken');
    this.telegramBot = new TelegramBot(telegramBotToken, { polling: true });

    this.telegramBot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.userStates[chatId] = {
        step: this.formSteps.started,
      };
      this.telegramBot.sendMessage(
        chatId,
        "Hi, I'm CrawlerBot! I can help you crawl websites. Please provide the URLs you want to crawl.",
        {
          reply_markup: {
            force_reply: true,
          },
        }
      );
    });

    this.telegramBot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const currentState = this.userStates[chatId];
      const text = msg.text;

      if (text.startsWith('/')) return;

      if (!currentState) {
        this.telegramBot.sendMessage(
          chatId,
          'Please start the conversation by sending /start.'
        );
        return;
      }
      switch (currentState.step) {
        case this.formSteps.started:
          this.userStates[chatId].urls = text
            .split(',')
            .map((url) => url.trim());
          this.userStates[chatId].step = this.formSteps.listSelector;
          this.telegramBot.sendMessage(
            chatId,
            'Please provide the HTML class selector to the list of URLs.',
            {
              reply_markup: {
                force_reply: true,
              },
            }
          );
          break;
        case this.formSteps.listSelector:
          this.userStates[chatId].urlListSelector = text;
          this.userStates[chatId].step = this.formSteps.contentSelector;
          this.telegramBot.sendMessage(
            chatId,
            'Please provide the HTML class selector to the content you want to extract.',
            {
              reply_markup: {
                force_reply: true,
              },
            }
          );
          break;
        case this.formSteps.contentSelector:
          this.userStates[chatId].contentSelector = text;
          this.userStates[chatId].step = this.formSteps.started;
          this.telegramBot.sendMessage(
            chatId,
            'Thank you! I will start crawling the provided URLs with the specified selectors. I will send you the crawled data shortly, please wait a moment...'
          );
          break;
      }

      Logger.INFO('User state updated:', this.userStates[chatId]);
    });
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
