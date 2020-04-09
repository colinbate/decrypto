import { save, load } from './storage.js';

const API_BASE = 'https://quote-api.colinbate.workers.dev/?date=DATE'
const LIST_KEY = 'LIST';
const TODAY_KEY = 'TODAY';
const INDEX_KEY = 'INDEX';

let todayStr = load(TODAY_KEY) || '';
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
      save(LIST_KEY, list);
      save(TODAY_KEY, todayStr);
      return list;
    });
  } else {
    if (!quotes) {
      quotes = Promise.resolve().then(() => {
        const list = load(LIST_KEY) || [];
        todayIndex = load(INDEX_KEY) || 0;
        return list;
      });
    }
  }
  return quotes;
}

export function getNewQuote() {
  return downloadQuotes().then(quotes => {
    const q = quotes.length ? quotes[todayIndex] : 'Could not load quote.';
    todayIndex = ((todayIndex + 1) % quotes.length) || 0;
    save(INDEX_KEY, todayIndex);
    return q;
  });
}