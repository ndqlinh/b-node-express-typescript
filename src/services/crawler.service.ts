import path from 'path';
import {
  PlaywrightCrawler,
  Dataset,
  Configuration,
  RequestQueue,
} from 'crawlee';
import aws_chromium from '@sparticuz/chromium';

import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import { Logger } from '@shared/helpers/logger.helper';
import TelegramService from './telegram.service';

interface CrawlConfig {
  urlListSelector: string;
  contentSelector: string;
  maxRequests?: number;
  contentQueryHandler?: (elements: (SVGElement | HTMLElement)[]) => any;
}

export default class CrawlerService {
  pagePattern = /page\/\d+/i;
  urlCrawler = null;
  contentCrawler = null;
  numberOfMaxRequests = 1000;
  minConcurrency = 1;
  maxConcurrency = 5;
  urlCrawlerDataset = null;
  contentCrawlerDataset = null;
  urlRequestQueue = null;
  contentRequestQueue = null;
  urlRequestList = null;
  contentRequestList = null;
  telegram: TelegramService;

  constructor() {
    this.telegram = new TelegramService();
    const config = Configuration.getGlobalConfig();
    config.set('persistStorage', false);
    config.set('purgeOnStart', true);
    config.set('persistStateIntervalMillis', 10_000);
    config.set('storageClientOptions', {
      localDataDirectory: path.join(__dirname, '.tmp', 'crawlee_storage'),
    });
  }

  async initializeCrawler(config: CrawlConfig) {
    let executablePath: string;
    try {
      executablePath = await aws_chromium.executablePath();
    } catch (error) {
      Logger.ERROR(`Failed to get Chrome executable path`, error);
      throw new HttpException(
        HTTPStatus.INTERNAL_SERVER_ERROR,
        'Failed to initialize Chrome browser'
      );
    }

    // Configure launcher options for AWS Lambda environment
    const launchOptions = {
      executablePath,
      args: [
        ...aws_chromium.args,
        '--disable-dev-shm-usage',
        '--single-process',
      ],
      headless: true,
    };

    await this.cleanCrawler();

    const self = this;

    // Initialize URL crawler - this will extract URLs from the specified selector
    this.urlCrawler = new PlaywrightCrawler({
      async requestHandler({ request, page, log }) {
        Logger.INFO(`Crawling for URLs...`, request.url);
        try {
          // Extract URLs from the specified selector
          const data = await page.$$eval(config.urlListSelector, (elements) => {
            const scrapedData = [];
            elements.forEach((element) => {
              const linkElement = element.querySelector('a');
              if (linkElement) {
                scrapedData.push({
                  title: linkElement.textContent?.trim() || '',
                  href: linkElement.getAttribute('href') || '',
                });
              }
            });
            return scrapedData;
          });

          await self.urlCrawlerDataset.pushData({
            data,
            url: request.loadedUrl,
            baseUrl: new URL(request.loadedUrl || '').origin,
          });
        } catch (error) {
          log.error(`Error crawling ${request.url}`, error);
        }
      },
      failedRequestHandler({ request, log }) {
        log.error(`Failed to crawl URL ${request.url}`);
      },
      requestQueue: this.urlRequestQueue,
      launchContext: {
        launchOptions,
      },
      maxRequestsPerCrawl: 1,
      minConcurrency: this.minConcurrency,
      maxConcurrency: this.maxConcurrency,
      requestHandlerTimeoutSecs: 30,
    });

    // Initialize content crawler - this will extract text content from the specified selector
    this.contentCrawler = new PlaywrightCrawler({
      async requestHandler({ request, page, log }) {
        log.info(`Crawling ${request.url} for content...`);
        try {
          // Extract content from the specified selector
          const content = await page.$$eval(
            config.contentSelector,
            config.contentQueryHandler
          );

          await self.contentCrawlerDataset.pushData({
            content,
            url: request.loadedUrl,
          });
        } catch (error) {
          log.error(`Error crawling content from ${request.url}`, error);
        }
      },
      failedRequestHandler({ request, log }) {
        log.error(`Failed to crawl URL ${request.url}`);
      },
      requestQueue: this.contentRequestQueue,
      launchContext: {
        launchOptions,
      },
      maxRequestsPerCrawl: 5,
      minConcurrency: this.minConcurrency,
      maxConcurrency: this.maxConcurrency,
      requestHandlerTimeoutSecs: 30,
    });
  }

  async crawlDataSequentially(
    urls: string[],
    chatId?: string | number
  ) {
    Logger.INFO('Chat ID:', chatId);
    try {
      // First step: crawl the initial URLs to extract links
      await this.urlCrawler.run(urls);
      Logger.INFO('Initial URL crawling complete', urls);

      // Get the extracted URLs
      const { items: urlItems } = await this.urlCrawlerDataset.getData({
        offset: 0,
        limit: 1000,
      });
      Logger.INFO('Extracted URLs:', urlItems);
      if (!urlItems || urlItems.length === 0) {
        return { urlData: [], contentData: [] };
      }

      // Prepare URLs for content crawling
      const contentUrls = [];
      const urlData = [];

      for (const item of urlItems) {
        const baseUrl = item.baseUrl || '';
        const extractedUrls = [];

        if (item.data && Array.isArray(item.data)) {
          for (const dataItem of item.data) {
            let fullUrl = '';

            // Handle relative URLs
            if (dataItem.href) {
              if (dataItem.href.startsWith('http')) {
                fullUrl = dataItem.href;
              } else if (dataItem.href.startsWith('/')) {
                fullUrl = `${baseUrl}${dataItem.href}`;
              } else {
                fullUrl = `${baseUrl}/${dataItem.href}`;
              }
              Logger.INFO('Full content URL:', fullUrl);
              contentUrls.push(fullUrl);
              extractedUrls.push({
                title: dataItem.title,
                originalHref: dataItem.href,
                fullUrl,
              });
            }
          }
        }

        urlData.push({
          sourceUrl: item.url,
          extractedUrls,
        });
      }

      // Step 2: Crawl each extracted URL to get the content
      if (contentUrls.length) {
        await this.contentCrawler.run(contentUrls);
        Logger.INFO('Content crawling complete', contentUrls);
      }

      // Get the crawled content
      const { items: contentItems } = await this.contentCrawlerDataset.getData({
        offset: 0,
        limit: 1000,
      });
      
      await this.reportCrawledData(contentItems, chatId);

      return {
        urlData,
        contentData: contentItems || [],
      };
    } catch (error) {
      Logger.ERROR('Error during sequential crawling', error);
      throw new HttpException(
        HTTPStatus.INTERNAL_SERVER_ERROR,
        'Error during crawling operation',
        error
      );
    }
  }

  private async cleanCrawler() {
    if (this.urlCrawlerDataset) {
      await this.urlCrawlerDataset.drop();
    }
    if (this.urlRequestQueue) {
      await this.urlRequestQueue.drop();
      Logger.INFO('Cleaned urlRequestQueue before start crawling');
    }
    Logger.INFO(
      'Initializing urlCrawlerDataset & urlRequestQueue for content storage'
    );
    this.urlCrawlerDataset = await Dataset.open('url_crawler_dataset');
    this.urlRequestQueue = await RequestQueue.open('url_request_queue');

    if (this.contentCrawlerDataset) {
      await this.contentCrawlerDataset.drop();
    }
    if (this.contentRequestQueue) {
      await this.contentRequestQueue.drop();
      Logger.INFO('Cleaned contentRequestQueue before start crawling');
    }
    Logger.INFO(
      'Initializing contentCrawlerDataset & contentRequestQueue for content storage'
    );
    this.contentCrawlerDataset = await Dataset.open('content_crawler_dataset');
    this.contentRequestQueue = await RequestQueue.open('content_request_queue');
  }

  async reportCrawledData(data: any, chatId?: string | number) {
    // Implement your logic to report crawled data
    Logger.INFO('Crawled data:', data);

    const postsContent = data.map((item) => {
      return {
        ...item.content[0],
        crawledUrl: item.url,
      };
    });
    Logger.INFO('Crawled posts content:', postsContent);

    // Convert JSON to a formatted string message
    let formattedMessage = 'Crawled Data:\n\n';

    if (postsContent && postsContent.length > 0) {
      formattedMessage += postsContent
        .map((item) => {
          // Create a line for each entry in format: Name: Phone
          return `${item.name || 'Unknown'}: ${item.phone || 'No phone'}`;
        })
        .join('\n');
    } else {
      formattedMessage += 'No data found.';
    }

    // Add crawl information
    formattedMessage += `\n\nTotal entries: ${
      postsContent.length
    }\nCrawled on: ${new Date().toLocaleString()}`;

    // Send the formatted message to Telegram
    await this.telegram.sendMessage(
      String(chatId || '1003418810'),
      formattedMessage
    );
  }
}
