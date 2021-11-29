import { createStore, compose, combineReducers } from 'redux/src/index.js';
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

const initialState = {
  page: 'dashboard',
};

const reducer = (state, action) => {
  if (!state) return initialState;
  switch (action.type) {
    case 'Set-Page':
      return Object.assign(state, { page: action.payload });
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  initialState,
  compose(lazyReducerEnhancer(combineReducers))
);
store.addReducers({ mainReducer: reducer });
export { store };
