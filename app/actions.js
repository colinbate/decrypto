export const SET_QUOTE = 'SET_QUOTE';
export const PARSED_QUOTE = 'PARSED_QUOTE';
export const ENTER_GUESS = 'ENTER_GUESS';
export const STORE_FIELD = 'STORE_FIELD';
export const RESET = 'RESET';

import Parser from './parser';

export function setQuote (quote) {
  return {
    quote,
    type: SET_QUOTE
  };
}

export function storeField (field, value) {
  return {
    type: STORE_FIELD,
    field,
    value
  };
}

export function parseQuote () {
  return (dispatch, getStore) => {
    const {quote, fields} = getStore();
    if (!quote || quote.trim() === '') {
      return false;
    }
    const cipher = (fields.get('given-cipher') || '').toUpperCase();
    const plain = (fields.get('given-plain') || '').toUpperCase();
    let flags;
    if (cipher && plain) {
      flags = {[cipher]: 'given'};
      setTimeout(() => dispatch(redraw(guess(cipher, plain))));
    }
    const tokens = (new Parser(quote)).tokenize(flags);
    dispatch(setLetters(tokens));
  };
}


function setLetters (letters) {
  return {
    letters,
    type: PARSED_QUOTE
  };
}

function redraw (action) {
  action.redraw = true;
  return action;
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

export function reset () {
  return {
    type: RESET
  };
}
