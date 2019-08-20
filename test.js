const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      'C:/Users/Administrator/AppData/Local/Google/Chrome/Application/chrome.exe',
    slowMo: 200,
    defaultViewport: {
      width: 320,
      height: 568
    }
  })
  const page = await browser.newPage()
  await page.goto('http://localhost:8080/apply')
  const selects = await page.$$('.select')

  await selects[0].click()
  await page.touchscreen.tap(100, 530)
  await page.mouse.click(200, 370)

  await selects[1].click()
  await page.touchscreen.tap(100, 530)
  await page.mouse.click(200, 370)

  const inputs = await page.$$('.apply-input')
  await inputs[0].type('测试')
  await inputs[1].type(getIdcard())
  await inputs[2].type(getPhoneNum())
  await page.click('.get-code')
  const getCode = await new Promise((resolve, reject) => {
    page.on('response', response => {
      resolve(response)
    })
  })
  const res = await getCode.json()
  await inputs[3].type(res.vailCode)
  await page.click('.next-step')
})()

function getPhoneNum () {
  let num = '1'
  for (let i = 0; i < 10; i++) {
    const n = parseInt(Math.random() * 10)
    num += n
  }
  return num
}

function getIdcard () {
  const area = '441421'
  const birth = '19931010'
  const order = ('00' + parseInt(Math.random() * 1000)).substr(-3)
  const last = lastCode(area + birth + order)
  return area + birth + order + last
}

function lastCode (code) {
  if (code.length !== 17) return ''
  const codes = code.split('')
  // ∑(ai×Wi)(mod 11)
  // 加权因子
  const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 校验位
  const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  let ai = 0
  let wi = 0
  for (let i = 0; i < 17; i++) {
    ai = codes[i]
    wi = factor[i]
    sum += ai * wi
  }
  const last = '' + parity[sum % 11]
  return last
}
