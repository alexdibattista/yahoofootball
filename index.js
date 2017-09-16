/*
 * @flow
 */
const puppeteer = require('puppeteer');

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
    headless: true, // false for debugging
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

  let PLAYER_MODAL_SELECTOR = '.yui3-widget-bd > div > div > .dynamicnote-hd > .playerinfo > .hd > h4 > .name';

  for (let i = 1; i <= tableLength; i++) {
    let playerNameSelector = PLAYER_STATUS_SELECTOR.replace("INDEX", i);
    page.click(playerNameSelector);
    await page.waitFor(2 * 1000);

    let player = await page.evaluate((sel) => {

      let name = document.querySelector(sel).innerHTML;
      let number = document.querySelector('.yui3-widget-bd > div > div > .dynamicnote-hd > .playerinfo > .playerdetails > dl > dd.num.last').innerHTML;
      let position = document.querySelector('.yui3-widget-bd > div > div > .dynamicnote-hd > .playerinfo > .playerdetails > dl > dd.pos').getElementsByTagName('span')[0].remove();
      position = document.querySelector('.yui3-widget-bd > div > div > .dynamicnote-hd > .playerinfo > .playerdetails > dl > dd.pos').innerHTML;
      let team = document.querySelector('.yui3-widget-bd > div > div > .dynamicnote-hd > .playerinfo > .playerdetails > dl > dd.team.last > a').innerHTML;

      let player = {
        name,
        number,
        position,
        team
      };

      return player;
    }, PLAYER_MODAL_SELECTOR);

    console.log(player);
  }




  // browser.close();
  // scrape defenses
  // Naviagate to players information
  // loop through all the players and save data to CSV.

}


run();
