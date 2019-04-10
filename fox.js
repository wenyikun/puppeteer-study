const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const sendMail = () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: '519518053@qq.com',
      pass: 'nogixlyxwzajbhad'
    }
  });
  const mailOptions = {
    from: '"温燚坤" 519518053@qq.com', // 发送者  
    to: 'wenyikun@bluemoon.com.cn', // 接受者,可以同时发送多个,以逗号隔开  
    subject: '邮箱内存快没了', // 标题  
    text: '邮箱内存快没了', // 文本
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('发送成功');
  });
}

(async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true
  });
  const page = await browser.newPage();
  await page.goto('https://mail.bluemoon.com.cn');
  await page.type('#uid', 'wenyikun@bluemoon.com.cn');
  await page.type('#password', 'yigeyi88', {
    delay: 100
  });
  await page.click('#login_button');
  await page.waitForNavigation();
  const frame = await page.frames().find(frame => frame.name().search('welcome') !== -1);
  const oSize = await frame.$('.nfMaxSize');
  const text = await frame.evaluate(o => parseFloat(o.innerText), oSize);
  if (text > 250) {
    sendMail();
  }
})();
