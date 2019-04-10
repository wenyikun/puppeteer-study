const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

(async () => {
  const browser = await puppeteer.launch();
  const getEmoji = async (id) => {
    const page = await browser.newPage();
    await page.goto(`https://pic.sogou.com/pic/emo/groupDetail.jsp?id=${id}&from=emo_home_group`);
    // 加载更多
    const loadMore = async () => {
      const more = await page.$('#moreBtn');
      if (more) {
        await more.click();
        await loadMore();
      }
    }
    await loadMore();
    await page.waitFor(1000);
    // 滚动到图片显示完全
    await page.addScriptTag({
      content: `var ul = document.getElementById('groupEmojiListUl');
      var wH = document.documentElement.clientHeight || document.body.clientHeight;
      window.scrollTo(0, ul.offsetHeight + ul.offsetTop - wH)`
    });
    await page.waitFor(1000);
    // 获取图片链接
    const group = await page.$('#groupEmojiListUl');
    if (!group) {
      await page.close();
      return;
    }
    const srcs = await page.evaluate((cont) => {
      const imgs = cont.getElementsByTagName('img');
      const srcs = [];
      for (let i = 0; i < imgs.length; i++) {
        srcs.push(imgs[i].src);
      }
      return srcs;
    }, group);
    // 获取标题
    const oName = await page.$('.info-name');
    const name = await page.evaluate((cont) => {
      return cont.innerText;
    }, oName);
    // 下载图片
    if (!fs.existsSync('./表情包')) {
      fs.mkdirSync('./表情包');
    }
    fs.mkdirSync(`./表情包/${id}-${name}`);
    const loadImg = (i) => {
      return new Promise((resolve, reject) => {
        axios.get(srcs[i], {
          responseType: 'stream'
        }).then((res) => {
          if (res.status === 200) {
            const type = res.headers['content-type'];
            let format = 'gif';
            if (type === 'image/jpeg') {
              format = 'jpg';
            } else if (type === 'image/png') {
              format = 'png';
            }
            const writeStream = fs.createWriteStream(`./表情包/${id}-${name}/${i + 1}.${format}`);
            res.data.pipe(writeStream);
            writeStream.on('finish', () => {
              resolve();
            });
            writeStream.on('error', () => {
              resolve();
            });
          } else {
            resolve();
          }
        }).catch((err) => {
          console.log('err', srcs[i]);
          resolve();
        });
      });
    };
    for (let i = 0; i < srcs.length; i++) {
      await loadImg(i);
    }
    await page.close();
  };
  for (let i = 249; i <= 5675; i++) {
    await getEmoji(i);
  }
  await getEmoji(500);
  browser.close();
})();
