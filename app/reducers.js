import { combineReducers } from 'redux';
import * as Actions from './actions';

function letters(state = [], action) {
  switch (action.type) {
    case Actions.PARSED_QUOTE:
      return action.letters;
    case Actions.RESET:
      return [];
  }
  return state;
}

function key (state = new Map(), action) {
  switch (action.type) {
    case Actions.ENTER_GUESS:
      if (state.get(action.cipher) !== action.plain) {
        if (action.plain) {
          return (new Map(state)).set(action.cipher, action.plain);
        } else {
          const newstate = (new Map(state));
          newstate.delete(action.cipher);
          return newstate;
        }
      }
    case Actions.RESET:
      return new Map();
  }
  return state;
}

function showSolver(state = false, action) {
  switch (action.type) {
    case Actions.PARSED_QUOTE:
      return !!action.letters.length;
    case Actions.RESET:
      return false;
  }
  return state;
}

function quote (state = '', action) {
  switch (action.type) {
    case Actions.SET_QUOTE:
      return action.quote;
    case Actions.RESET:
      return '';
  }
  return state;
}

function fields (state = new Map(), action) {
  let newstate;
  switch (action.type) {
    case Actions.STORE_FIELD:
      newstate = new Map(state);
      newstate.set(action.field, action.value);
      return newstate;
    case Actions.RESET:
      return new Map();
  }
  return state;
}

const rootReducer = combineReducers({
  letters,
  key,
  showSolver,
  quote,
  fields
});

export default rootReducer;