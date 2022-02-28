import { createStore, compose, combineReducers } from 'redux/src/index.js';
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

const initialState = {
  clouds: {},
  machines: {},
  images: {},
  sectionsCount: {
    images: 0,
  },
};
function toItemMap(array) {
  const itemMap = {};
  array.forEach(item => {
    itemMap[item.id] = item;
  });
  return itemMap;
}
function updateResource(resource, state, payload) {
  let data = payload;
  if (Array.isArray(data)) data = toItemMap(data);
  const newResources = { ...state[resource], ...data };
  const toAssign = {};
  toAssign[resource] = newResources;
  return { ...state, ...toAssign };
}
/* eslint-disable prefer-object-spread */
// Object assign is the recommended way to go with redux's state
const reducer = (state, action) => {
  if (!state) return initialState;
  switch (action.type) {
    case 'Update-Clouds': {
      return updateResource('clouds', state, action.payload);
    }
    case 'Update-Machines': {
      const machines = Object.assign({}, state.machines, action.payload);
      return Object.assign({}, state, { machines });
    }
    case 'Update-Images': {
      return updateResource('images', state, action.payload);
    }
    case 'Update-Sections-Count': {
      // action.payload should be {resource: int}
      const newSectionsCount = Object.assign(
        {},
        state.sectionsCount,
        action.payload
      );
      return Object.assign({}, state, newSectionsCount);
    }
    case 'Set-Sections-Count':
      return Object.assign({}, state, { sectionsCount: action.payload });
    default:
      return state;
  }
};
/* eslint-enable prefer-object-spread */

const store = createStore(
  reducer,
  initialState,
  compose(lazyReducerEnhancer(combineReducers))
);
store.addReducers({ mainReducer: reducer });
export { store };
