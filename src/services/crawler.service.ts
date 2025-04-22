import { PlaywrightCrawler, Dataset, Configuration } from 'crawlee';
import aws_chromium from '@sparticuz/chromium';

import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import { Logger } from '@shared/helpers/logger.helper';
import path from 'path';

interface CrawlConfig {
  urlListSelector: string;
  contentSelector: string;
  maxRequests?: number;
  transformUrls?: (url: string, baseUrl: string) => string;
}

export default class CrawlerService {
  pagePattern = /page\/\d+/i;
  urlCrawler = null;
  contentCrawler = null;
  numberOfMaxRequests = 1;
  urlCrawlerDataset = null;
  contentCrawlerDataset = null;

  constructor() {
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

    // Clear previous datasets if they exist
    if (this.urlCrawlerDataset) {
      await this.urlCrawlerDataset.drop();
    }
    if (this.contentCrawlerDataset) {
      await this.contentCrawlerDataset.drop();
    }

    this.urlCrawlerDataset = await Dataset.open('url_crawler_dataset');
    this.contentCrawlerDataset = await Dataset.open('content_crawler_dataset');

    const self = this;
    this.numberOfMaxRequests = config.maxRequests || 1;

    // Initialize URL crawler - this will extract URLs from the specified selector
    this.urlCrawler = new PlaywrightCrawler({
      async requestHandler({ request, page, log }) {
        log.info(`Crawling ${request.url} for URLs...`);
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
            baseUrl: new URL(request.loadedUrl || '').origin
          });
        } catch (error) {
          log.error(`Error crawling ${request.url}`, error);
        }
      },
      launchContext: {
        launchOptions,
      },
      maxRequestsPerCrawl: this.numberOfMaxRequests,
    });

    // Initialize content crawler - this will extract text content from the specified selector
    this.contentCrawler = new PlaywrightCrawler({
      async requestHandler({ request, page, log }) {
        log.info(`Crawling ${request.url} for content...`);
        try {
          // Extract content from the specified selector
          const content = await page.$$eval(config.contentSelector, (elements) => {
            return elements.map((element) => ({
              name: element.getElementsByClassName('name')[0].textContent?.trim() || '',
              phone: element.getElementsByClassName('fone')[0].getElementsByTagName('a')[0].textContent?.trim() || '',
            }));
          });

          await self.contentCrawlerDataset.pushData({
            content,
            url: request.loadedUrl
          });
        } catch (error) {
          log.error(`Error crawling content from ${request.url}`, error);
        }
      },
      launchContext: {
        launchOptions,
      },
      maxRequestsPerCrawl: 10 * this.numberOfMaxRequests, // More requests allowed for content crawling
    });
  }

  async crawlDataSequentially(urls: string[], config: CrawlConfig) {
    try {
      // First step: crawl the initial URLs to extract links
      await this.urlCrawler.run(urls);
      Logger.INFO('Initial URL crawling complete', urls);

      // Get the extracted URLs
      const { items: urlItems } = await this.urlCrawlerDataset.getData({ offset: 0, limit: 1000 });
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
              if (config.transformUrls) {
                fullUrl = config.transformUrls(dataItem.href, baseUrl);
              } else if (dataItem.href.startsWith('http')) {
                fullUrl = dataItem.href;
              } else if (dataItem.href.startsWith('/')) {
                fullUrl = `${baseUrl}${dataItem.href}`;
              } else {
                fullUrl = `${baseUrl}/${dataItem.href}`;
              }

              contentUrls.push(fullUrl);
              extractedUrls.push({
                title: dataItem.title,
                originalHref: dataItem.href,
                fullUrl
              });
            }
          }
        }

        urlData.push({
          sourceUrl: item.url,
          extractedUrls
        });
      }

      // Step 2: Crawl each extracted URL to get the content
      if (contentUrls.length > 0) {
        await this.contentCrawler.run(contentUrls);
        Logger.INFO('Content crawling complete', contentUrls);
      }

      // Get the crawled content
      const { items: contentItems } = await this.contentCrawlerDataset.getData({ offset: 0, limit: 1000 });

      Logger.INFO('Content crawling complete', contentItems);

      return {
        urlData,
        contentData: contentItems || []
      };
    } catch (error) {
      Logger.ERROR('Error during sequential crawling', error);
      throw new HttpException(
        HTTPStatus.INTERNAL_SERVER_ERROR,
        'Error during crawling operation'
      );
    }
  }
}
