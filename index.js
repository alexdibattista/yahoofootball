/*
 * @flow
 */
 const puppeteer = require('puppeteer');
 const cliSpinners = require('cli-spinners');

const credentials = require('./credentials');


// HTML Selectors
const USERNAME_SELECTOR = '#login-username';
const USERNAME_SUBMIT_SELECTOR = '#login-signin';
const PASSWORD_SELECTOR = '#login-passwd';
const PASSWORD_SUBMIT_SELECTOR = '#login-signin';
const LENGTH_OF_TABLE = 'tr';

let LIST_PLAYER_SELECTOR = '.Table > tbody > tr:nth-child(INDEX) > .player > div > .Grid-bind-end > .ysf-player-name > .name';
let PLAYER_STATUS_SELECTOR = '.Table > tbody > tr:nth-child(INDEX) > .player > div > .Grid-bind-end > .player-status > a';

async function run() {
  const yahooLogin = 'https://login.yahoo.com';
  const yahooFootball = 'https://football.fantasysports.yahoo.com/';
  const yahooFootballAllPlayers = 'https://football.fantasysports.yahoo.com/f1/38877/players?&sort=AR&sdir=1&status=ALL&pos=O&stat1=S_S_2017&jsenabled=1';
  const browser = await puppeteer.launch({
    headless: false, // false for debugging
    timeout: 0
  });
  const page = await browser.newPage();
  await page.goto(yahooLogin);

  // Click on the login input box
  console.log('Enter Username');
  page.click(USERNAME_SELECTOR);
  page.type(credentials.username)
  console.log('Submit Username');
  page.click(USERNAME_SUBMIT_SELECTOR);
  await page.waitForNavigation();

  // Click on the login input box
  console.log('Enter Password');
  page.click(PASSWORD_SELECTOR);
  page.type(credentials.password)
  console.log('Submit Password');;
  page.click(PASSWORD_SUBMIT_SELECTOR);
  await page.waitForNavigation();
  console.log('Go to yahoo football');
  await page.goto(yahooFootballAllPlayers);

  let tableLength = await page.evaluate((sel) => {
    const table = document.querySelector('.Table').getElementsByTagName('tbody')[0];
    return table.getElementsByTagName(sel).length;
  }, LENGTH_OF_TABLE);

  console.log(`number of rows: ${tableLength}`);

  for (let i = 1; i <= tableLength; i++) {
    let playerNameSelector = PLAYER_STATUS_SELECTOR.replace("INDEX", i);
    page.click(playerNameSelector);
    await page.waitFor(2 * 1000);

    let playerName = await page.evaluate(() => {
      return document.querySelector('.yui3-widget-bd > div > div > .dynamicnote-hd > .playerinfo > .hd > h4 > .name').innerHTML;
    });

    console.log(playerName);
  }




  // browser.close();
  // scrape defenses
  // Naviagate to players information
  // loop through all the players and save data to CSV.

}


run();
