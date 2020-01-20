const tinify = require("tinify");
const fs = require("fs");
var path = require('path');
const puppeteer = require('puppeteer');

const TINIFY_KEY = "WXyqZW21XRBKwKLtJq1PqG0QltfSxFT2";
const ORIGIN_PATH = './src';
const TARGET_PATH = './dist';

let originPath = ORIGIN_PATH;
let targetPath = TARGET_PATH;

function init() {
  tinify.key = TINIFY_KEY;
  console.log(`compressionsThisMonth: ${getcompressionCount()}`);
}

function compressImg(filePath, fileName, targetPath) {
  console.log(`compress ${fileName} to ${targetPath} is begin`);
  const source = tinify.fromFile(path.join(filePath, fileName));
  source.toFile(path.join(targetPath, fileName)).then(async (res) => {
    console.log(`compress ${fileName} to ${targetPath} done`);
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
    const fileUploader = await page.$('input');
    // const uploadFile = await fileUploader.$(".ajax-file-upload");
    // console.log(fileUploader.children);
    // console.log(333);
    // await fileUploader.uploadFile(path.join(targetPath, fileName));
    console.log(444);
    fileUploader.click();
  });
}
// 获取本月已使用的压缩次数
function getcompressionCount() {
  let compressionsThisMonth = tinify.compressionCount;
  return compressionsThisMonth || 0;
}

//  遍历目录得到文件信息
function walk(filePath, callback) {
  const files = fs.readdirSync(filePath);

  files.forEach(function(fileName, res) {
    if (/.(jpg|jpeg|png)$/.test(fileName)) {
      callback(filePath, fileName);
    }
  });
}

const argv = process.argv;
if (argv.length > 2) {
  originPath = argv[2];
  targetPath = argv[3];
}

init();
walk(originPath, function(filePath, fileName) {
  compressImg(filePath, fileName, targetPath);
});