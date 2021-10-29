import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  let results = [];
  let url = 'https://sad-swanson-d421c3.netlify.app/cookbook.html';
  for (let i = 0; i < 100; i++) {
    console.log(i);
    // crawl in blocks of 10, there's prob a smarter way
    await Promise.all([
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
      crawl(url)
        .then((result) => results.push(result))
        .catch(console.error),
    ]);
  }
  fs.writeFileSync('./results-cookbook.json', JSON.stringify(results.filter(Boolean), null, 2), 'utf-8');
})();

async function crawl(url) {
  let browser = await puppeteer.launch({ headless: true, devtools: false });
  try {
    let context = await browser.createIncognitoBrowserContext();
    let page = await context.newPage();
    await page.emulateNetworkConditions(puppeteer.networkConditions['Slow 3G']);

    await page.evaluateOnNewDocument(() => {
      const channel = new BroadcastChannel('sw-messages');
      channel.addEventListener('message', (event) => {
        window.result = event.data;
      });
    });

    await page.goto(url);

    await page.waitForFunction(() => {
      return window.result !== undefined;
    });
    let result = await page.evaluate(() => window.result);
    return result;
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
}
