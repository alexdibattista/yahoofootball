const credentials = require('./credentials');
const puppeteer = require('puppeteer');

// HTML Selectors
const USERNAME_SELECTOR = '';
const USERNAME_SUBMIT_SELECTOR = '';
const PASSWORD_SELECTOR = '';
const PASSWORD_SUBMIT_SELECTOR = '';


async function run() {
  const yahooLogin = 'https://login.yahoo.com';
  const browser = await puppeteer.launch({
    headless: false // debugging 
  });
  const page = await browser.newPage();
  await page.goto(yahooLogin);

  // Click on the login input box
  page.click(USERNAME_SELECTOR);
  page.type(credentials.username);
  page.click(USERNAME_SUBMIT_SELECTOR);
  page.waitForNavigation();

  // Click on the login input box
  page.click(PASSWORD_SELECTOR);
  page.type(credentials.password);
  page.click(PASSWORD_SUBMIT_SELECTOR);
  page.waitForNavigation();

  // Naviagate to players information
  // loop through all the players and save data to CSV.
  
}
