// import { writable } from 'svelte/store';

const API_BASE = 'https://api.razzlepuzzles.com/cryptograms?om=false&locale=en&z=DATE-1'

let todayStr = '';
let todayIndex = 0;
let quotes = null;

function extractQuote(entry) {
  const [,,, crypt] = entry.split('::');
  return crypt;
}

function pad(val) {
  return val < 10 ? `0${val}` : `${val}`;
}

function getToday() {
  const now = new Date();
  return `${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}${pad(now.getUTCFullYear() - 2000)}`;
}

function downloadQuotes() {
  const today = getToday();
  if (today !== todayStr) {
    todayStr = today;
    const url = API_BASE.replace('DATE', today);
    quotes = fetch(url).then(r => r.json()).then(qs => qs.map(extractQuote)).then(list => {
      todayIndex = 0;
      return list;
    });
  }
  return quotes;
}

export function getNewQuote() {
  return downloadQuotes().then(quotes => {
    const q = quotes[todayIndex];
    todayIndex = (todayIndex + 1) % quotes.length;
    return q;
  });
}