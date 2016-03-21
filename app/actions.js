export const SET_QUOTE = 'SET_QUOTE';
export const PARSED_QUOTE = 'PARSED_QUOTE';
export const ENTER_GUESS = 'ENTER_GUESS';

import Parser from './parser';

export function setQuote (quote) {
  return {
    quote,
    type: SET_QUOTE
  };
}

export function parseQuote () {
  return (dispatch, getStore) => {
    const {quote} = getStore();
    const tokens = (new Parser(quote)).tokenize();
    dispatch(setLetters(tokens));
  };
}

function setLetters (letters) {
  return {
    letters,
    type: PARSED_QUOTE
  };
}

function guess (cipher, plain) {
  return {
    cipher,
    plain,
    type: ENTER_GUESS
  };
}

export function enterGuess (cipher, plain) {
  plain = plain.toUpperCase();
  if (plain.length > 1) {
    return (dispatch, getStore) => {
      const {key} = getStore();
      const prev = key.get(cipher);
      const newchar = plain.replace(prev, '');
      if (newchar.length > 1 || newchar === prev) {
        return;
      }
      dispatch(guess(cipher, newchar));
    };
  }
  return guess(cipher, plain);
}
