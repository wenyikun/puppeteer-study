const puppeteer = require('puppeteer');
const fs = require('fs');
const download = require('download');
const baseLink = 'http://www.ypppt.com/moban/zongjie/';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const data = [];
  await page.goto(baseLink);
  // 获取页数
  const lasts = await page.$$('.page-navi a');
  const pages = await page.evaluate((last) => {
    return parseInt(last.href.match(/\d+/)[0]);
  }, lasts[lasts.length - 1]);
  // 获取每页列表数据
  for (let i = 1; i <= pages; i++) {
    if (i !== 1) {
      await page.goto(`${baseLink}list-${i}.html`);
    }
    const links = await page.$$('.p-title');
    for (const item of links) {
      const res = await page.evaluate((link) => {
        return {
          href: link.href,
          title: link.innerHTML,
        }
      }, item);
      data.push(res);
    }
  }
  // 进入页面下载
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    await page.goto(item.href);
    const downBtn = await page.$('.down-button');
    const href = await page.evaluate(obj => obj.href, downBtn);
    await page.goto(href);
    const down = await page.$('.down a');
    const downLink = await page.evaluate(obj => obj.href, down);
    if (/\.rar$/.test(downLink)) {
      download(downLink).then(s => {
        fs.writeFileSync(`./zongjie/${item.title}.rar`, s);
      });
    }
    console.log(downLink, data.length, i + 1);
  }
  browser.close();
})();
