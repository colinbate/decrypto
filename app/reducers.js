import { combineReducers } from 'redux';
import * as Actions from './actions';

function letters(state = [], action) {
  switch (action.type) {
    case Actions.PARSED_QUOTE:
      console.log('letters: PARSED_QUOTE');
      console.log(action.letters);
      return action.letters;
  }
  return state;
}

function key (state = new Map(), action) {
  switch (action.type) {
    case Actions.ENTER_GUESS:
      if (state.get(action.cipher) !== action.plain) {
        return (new Map(state)).set(action.cipher, action.plain);
      }
  }
  return state;
}

function showSolver(state = false, action) {
  switch (action.type) {
    case Actions.PARSED_QUOTE:
      console.log('showSolver: PARSED_QUOTE');
      console.log(!!action.letters.length);
      return !!action.letters.length;
  }
  return state;
}

function quote (state = '', action) {
  switch (action.type) {
    case Actions.SET_QUOTE:
      return action.quote;
  }
  return state;
}

const rootReducer = combineReducers({
  letters,
  key,
  showSolver,
  quote
});

export default rootReducer;