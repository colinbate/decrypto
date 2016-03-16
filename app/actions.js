export const PARSE_QUOTE = 'PARSE_QUOTE';
export const ENTER_GUESS = 'ENTER_GUESS';

export function parseQuote(quote) {
  return {
    quote,
    type: PARSE_QUOTE
  };
}

export function enterGuess() {
  return {
    type: ENTER_GUESS
  };
}
