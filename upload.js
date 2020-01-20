const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('http://60.205.219.82:9999/uploadimg');
  const loginBlock = await page.$('.login_block');
  // //输入账号密码
  const usernameEle = await loginBlock.$('#username');
  await usernameEle.type('xiaoqiang');
  const passwordEle = await loginBlock.$('#password');
  await passwordEle.type('12345');
  //点击确定按钮进行登录
  const loginBtn = await page.$('[name=loginbtn]');
  //等待页面跳转完成，一般点击某个按钮需要跳转时，都需要等待 page.waitForNavigation() 执行完毕才表示跳转成功
  await Promise.all([
    loginBtn.click(),
    page.waitForNavigation()
  ]);
  console.log('admin 登录成功');

  // const uploadEntrance = await page.$('[name=loginbtn]');

  const upload_file = await page.$("input#ajax-upload-id-1579512994394");
  await upload_file.uploadFile("你的文件路径");
})();