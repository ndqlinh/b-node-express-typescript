import { BaseResponse } from '@shared/helpers/response.helper';
import { Logger } from '@shared/helpers/logger.helper';
import CrawlerService from '../services/crawler.service';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';

const crawler = new CrawlerService();

interface CrawlRequest {
  urls: string[];
  urlListSelector: string;
  contentSelector: string;
  maxRequests?: number;
}

export const crawlMultipleUrls = async (
  event: any,
  _context: any
): Promise<any> => {
  Logger.INFO('REQUEST', event);
  let requestBody: CrawlRequest;

  try {
    requestBody = typeof event.body === 'string'
      ? JSON.parse(event.body)
      : event.body;

    // Validate required fields
    if (!requestBody.urls || !Array.isArray(requestBody.urls) || requestBody.urls.length === 0) {
      return BaseResponse.toError(new HttpException(HTTPStatus.BAD_REQUEST, 'URLs array is required and must not be empty'));
    }

    if (!requestBody.urlListSelector) {
      return BaseResponse.toError(new HttpException(HTTPStatus.BAD_REQUEST, 'urlListSelector is required'));
    }

    if (!requestBody.contentSelector) {
      return BaseResponse.toError(new HttpException(HTTPStatus.BAD_REQUEST, 'contentSelector is required'));
    }

    // Initialize crawler with the provided configuration
    await crawler.initializeCrawler({
      urlListSelector: requestBody.urlListSelector,
      contentSelector: requestBody.contentSelector,
      maxRequests: requestBody.maxRequests || 1
    });

    // Execute the two-level crawling
    const result = await crawler.crawlDataSequentially(requestBody.urls, {
      urlListSelector: requestBody.urlListSelector,
      contentSelector: requestBody.contentSelector,
      maxRequests: requestBody.maxRequests || 1
    });

    return BaseResponse.toSuccess({
      message: 'Crawled data successfully!',
      data: result,
    });
  } catch (error) {
    Logger.ERROR('Error processing crawl request', error);
    return BaseResponse.toError(new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Error processing crawl request'));
  }
};
