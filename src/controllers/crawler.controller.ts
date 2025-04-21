import { BaseResponse } from '@shared/helpers/response.helper';
import { Logger } from '@shared/helpers/logger.helper';
import CrawlerService from '../services/crawler.service';

const crawler = new CrawlerService();

export const crawlMultipleUrls = async (
  event: any,
  _context: any
): Promise<any> => {
  Logger.INFO('REQUEST', event);
  const requestBody = event.body;
  await crawler.initializeCrawler();
  const result = await crawler.crawlDataSequentially(requestBody.urls);

  return BaseResponse.toSuccess({
    message: 'Crawled data successfully!',
    // data: result,
  });
};
