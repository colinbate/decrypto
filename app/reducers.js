import { combineReducers } from 'redux';
import * as Actions from './actions';

function letters(state = [], action) {
  return state;
}

const rootReducer = combineReducers({
  letters
});

export default rootReducer;