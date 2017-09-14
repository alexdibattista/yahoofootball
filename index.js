const credentials = require('./credentials');
const puppeteer = require('puppeteer');

// HTML Selectors
const USERNAME_SELECTOR = '#login-username';
const USERNAME_SUBMIT_SELECTOR = '#login-signin';
const PASSWORD_SELECTOR = '#login-passwd';
const PASSWORD_SUBMIT_SELECTOR = '#login-signin';
const LENGTH_OF_TABLE = 'tr';

const LIST_USERNAME_SELECTOR = 'tr:nth-child(INDEX)';

async function run() {
  const yahooLogin = 'https://login.yahoo.com';
  const yahooFootball = 'https://football.fantasysports.yahoo.com/';
  const yahooFootballAllPlayers = 'https://football.fantasysports.yahoo.com/f1/38877/players?&sort=AR&sdir=1&status=ALL&pos=O&stat1=S_S_2017&jsenabled=1';
  const browser = await puppeteer.launch({
    headless: true // debugging
  });
  const page = await browser.newPage();
  await page.goto(yahooLogin);

  // Click on the login input box
  page.click(USERNAME_SELECTOR);
  page.type(credentials.username);
  page.click(USERNAME_SUBMIT_SELECTOR);
  await page.waitForNavigation();

  // Click on the login input box
  page.click(PASSWORD_SELECTOR);
  page.type(credentials.password);
  page.click(PASSWORD_SUBMIT_SELECTOR);
  await page.waitForNavigation();
  await page.goto(yahooFootballAllPlayers);

  let tableLength = await page.evaluate((sel) => {
    const table = document.querySelector('.Table').getElementsByTagName('tbody')[0];
    return table.getElementsByTagName(sel).length;
  }, LENGTH_OF_TABLE);

  console.log(`number of rows: ${tableLength}`);

  for (let i = 1; i < tableLength; i++) {
    let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);

    let username = await page.evaluate((sel) => {
        const table = document.querySelector('.Table').getElementsByTagName('tbody')[0];
        return table.querySelector(sel);
      }, usernameSelector);

    console.log(username);
  }

  // let player = await page.evaluate(() => {
  //   const table = document.querySelector('.Table').innerHTML;
  //   return table;
  // });
  //
  // console.log(player);

  browser.close();

  // Naviagate to players information
  // loop through all the players and save data to CSV.

}


run();
