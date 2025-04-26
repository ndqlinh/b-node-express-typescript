import { BaseResponse } from '@shared/helpers/response.helper';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import { Logger } from '@shared/helpers/logger.helper';
import TelegramService from '../services/telegram.service';

const telegram = new TelegramService();
telegram.initialize();

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    if (body.message) {
      const { chat, text, from } = body.message;
      Logger.INFO('Chat ID:', chat.id);
      Logger.INFO(`Received message from ${from.username}: ${text}`);
      await telegram.sendMessage(
        chat.id,
        'Hello! I am your friendly CrawlerBot. Please provide the URLs you want to crawl.'
      );
    }

    return BaseResponse.toSuccess({
      message: 'Ok!',
    });
  } catch (error) {
    Logger.ERROR('Error processing Telegram update:', error);
    return BaseResponse.toError(
      new HttpException(
        HTTPStatus.INTERNAL_SERVER_ERROR,
        'Error processing Telegram update'
      )
    );
  }
};
