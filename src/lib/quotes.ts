import { save, load } from './storage.js';

const API_BASE = 'https://quote-api.colinbate.workers.dev/?date=DATE';
const LIST_KEY = 'LIST';
const TODAY_KEY = 'TODAY';
const INDEX_KEY = 'INDEX';

let todayStr = load(TODAY_KEY) || '';
let todayIndex = 0;
let quotes: string[] | undefined;

function extractQuote(entry: string) {
	const [, , , crypt] = entry.split('::');
	return crypt;
}

function pad(val: number) {
	return val < 10 ? `0${val}` : `${val}`;
}

function getToday() {
	const now = new Date();
	return `${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}${pad(now.getUTCFullYear() - 2000)}`;
}

async function downloadQuotes() {
	const today = getToday();
	if (today !== todayStr) {
		todayStr = today;
		const url = API_BASE.replace('DATE', today);
		quotes = await fetch(url)
			.then((r) => r.json())
			.then((qs) => qs.map(extractQuote));

		todayIndex = 0;
		save(LIST_KEY, quotes);
		save(TODAY_KEY, todayStr);
	} else if (!quotes) {
		quotes = load(LIST_KEY) || [];
		todayIndex = load(INDEX_KEY) || 0;
	}
	return quotes;
}

export async function getNewQuote() {
	const qs = await downloadQuotes();
	const q = qs && qs.length ? qs[todayIndex] : 'Could not load quote.';
	todayIndex = qs ? (todayIndex + 1) % qs.length : 0;
	save(INDEX_KEY, todayIndex);
	return q;
}
