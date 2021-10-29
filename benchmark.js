import puppeteer from 'puppeteer';

(async () => {
  let result = await crawl('https://sad-swanson-d421c3.netlify.app/vanilla.html');
  console.log(result);
})();

async function crawl(url) {
  let browser = await puppeteer.launch({ headless: false, devtools: true });
  let context = await browser.createIncognitoBrowserContext();
  let page = await context.newPage();

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

  await browser.close();

  return result;
}
