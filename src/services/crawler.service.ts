import { PlaywrightCrawler, Dataset, Configuration } from 'crawlee';
import aws_chromium from '@sparticuz/chromium';

import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import { Logger } from '@shared/helpers/logger.helper';
import path from 'path';

export default class CrawlerService {
  pagePattern = /page\/\d+/i;
  crawler = null;
  numberOfMaxRequests = 1;
  crawlerDataset = null;

  constructor() {
    const config = Configuration.getGlobalConfig();
    config.set('persistStorage', false);
    config.set('purgeOnStart', true);
    config.set('persistStateIntervalMillis', 10_000);
    config.set('storageClientOptions', {
      localDataDirectory: path.join(__dirname, '.tmp', 'crawlee_storage'),
    });
  }

  async initializeCrawler() {
    // if (this.crawlerDataset) {
    //   this.crawlerDataset.drop();
    // }

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

    if (this.crawlerDataset) {
      await this.crawlerDataset.drop();
    }
    this.crawlerDataset = await Dataset.open('crawled_dataset');
    const self = this;
    this.crawler = new PlaywrightCrawler({
      async requestHandler({ request, page, enqueueLinks, log }) {
        const data = await page.$$eval('.items .item', ($posts) => {
          const scrapedData: { title: string; href: string }[] = [];
          $posts.forEach(($post) => {
            scrapedData.push({
              title: $post.querySelector('.ct_title a').textContent,
              href: $post.querySelector('.ct_title a').getAttribute('href'),
            });
          });

          return scrapedData;
        });
        await self.crawlerDataset.pushData({ data, url: request.loadedUrl });
        await enqueueLinks();
      },
      launchContext: {
        launchOptions: {
          executablePath,
          args: [
            ...aws_chromium.args,
            '--disable-dev-shm-usage',
            '--single-process',
          ],
          headless: true,
        },
      },
      maxRequestsPerCrawl: this.numberOfMaxRequests,
    });
  }

  async crawlDataSequentially(urls: string[]) {
    await this.crawler.run(urls);
    const crawledPosts = await Dataset.getData();
    const { items } = await this.crawlerDataset.getData();
    Logger.INFO('Crawler dataset:', items);

    return crawledPosts;
  }
}
