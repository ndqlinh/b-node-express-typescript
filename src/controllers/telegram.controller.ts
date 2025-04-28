import { BaseResponse } from '@shared/helpers/response.helper';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import { Logger } from '@shared/helpers/logger.helper';
import TelegramService from '../services/telegram.service';
import CrawlerService from '../services/crawler.service';

const telegram = new TelegramService();
const telegramBot = telegram.initialize();
const crawler = new CrawlerService();

const crawlTopics = {
  alonhadat: {
    urls: ['https://alonhadat.com.vn/'],
    urlListSelector: '.new-property-box .items .item',
    contentSelector: 'div.contact-info div.content',
    contentQueryHandler: (elements: (SVGElement | HTMLElement)[]) => {
      return elements.map((element: SVGElement | HTMLElement) => ({
        name: element.querySelector('.name')?.textContent?.trim() || '',
        phone:element
          .querySelector('.fone')
          ?.querySelector('a')
          ?.textContent?.trim()
          .replaceAll('.', '') || ''
      }))
    },
  },
  homedy: {
    urls: ['https://homedy.com/ban-nha-dat/'],
    urlListSelector: '.tab-content .product-item',
    contentSelector: '.agency .info-agency',
    contentQueryHandler: (elements: (SVGElement | HTMLElement)[]) => {
      return elements.map((element: SVGElement | HTMLElement) => ({
        name: element.querySelector('.name a').textContent?.trim() || '',
        phone:element
          .querySelector('.info a.mobile')
          .getAttribute('data-mobile')
          .trim()
          ?.replaceAll('.', '') || ''
      }))
    },
  },
};

/**
 * Handle callback queries from inline keyboard buttons
 */
async function handleCallbackQuery(query: any) {
  try {
    const chatId = query.message.chat.id;
    const data = query.data;
    Logger.INFO('Callback Query:', query);

    Logger.INFO(
      `Received callback query with data: ${data} from chat ID: ${chatId}`
    );

    // Acknowledge the callback query to stop the loading animation on the button
    await telegramBot.answerCallbackQuery(query.id);

    if (crawlTopics[data]) {
      await telegram.sendMessage(
        chatId,
        `You selected ${data}. I will start crawl and send reponse to you after finished.`
      );
      // Initialize the crawler with the provided configuration
      await crawler.initializeCrawler(crawlTopics[data]);
      // Execute the two-level crawling
      await crawler.crawlDataSequentially(
        crawlTopics[data].urls,
        chatId
      );
    } else {
      await telegram.sendMessage(
        chatId,
        `Sorry, crawling for ${data} is not yet implemented.`
      );
      return;
    }
  } catch (error) {
    Logger.ERROR('Error handling callback query:', error);
  }
}

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    // Handle callback queries from button clicks
    if (body.callback_query) {
      await handleCallbackQuery(body.callback_query);
      return BaseResponse.toSuccess({
        message: 'Callback query processed successfully',
      });
    }

    // Handle regular messages
    if (body.message) {
      const { chat, text, from } = body.message;
      Logger.INFO('Chat ID:', chat.id);
      Logger.INFO(`Received message from ${from.username}: ${text}`);
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: Object.keys(crawlTopics).map((topic) => [
            {
              text: topic,
              callback_data: topic,
            },
          ]),
        }),
      };
      await telegram.sendMessage(
        chat.id,
        'Hello! I am your friendly CrawlerBot. Please select the website you want to crawl:',
        options
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
