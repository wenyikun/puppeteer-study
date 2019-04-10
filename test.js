const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://tmallapi.bluemoon.com.cn/FE/cooperation-vue/apply');
  await page.click('.select');
  const items = await page.$$('.picker-item')
  console.log(items)
})();
