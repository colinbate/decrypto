import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { redrawMiddleware } from 'mithril-redux';
import rootReducer from './reducers';
import persistState from 'redux-localstorage';

const serialize = (obj) => {
  const easier = {
    ...obj,
    key: [...obj.key],
    fields: [...obj.fields]
  };
  return JSON.stringify(easier);
};

const deserialize = (str) => {
  const hydrated = JSON.parse(str);
  hydrated.key = new Map(hydrated.key);
  hydrated.fields = new Map(hydrated.fields);
  return hydrated;
};

export default function configureStore(initialState) {
  // const createModifiedStore = applyMiddleware(
  //   thunkMiddleware,
  //   redrawMiddleware
  // )(createStore);
  // const persistentStore = compose(persistState(void 0, {serialize, deserialize}))(createModifiedStore);
  // //const reducer = compose(mergePersistedState())(rootReducer);
  // return persistentStore(rootReducer, initialState);
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      redrawMiddleware
    ),
    persistState(void 0, {serialize, deserialize})
  );
  const store = createStore(rootReducer, initialState, enhancer);
  return store;
}