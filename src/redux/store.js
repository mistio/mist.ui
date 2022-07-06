import { configureStore } from '@reduxjs/toolkit';

// import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

import configReducer from './slices/config.js';
import sectionsReducer from './slices/sections.js';
import orgsReducer from './slices/orgs.js';
import orgReducer from './slices/org.js';

export const store = configureStore({
  reducer: {
    config: configReducer,
    sections: sectionsReducer,
    orgs: orgsReducer,
    org: orgReducer,
  },
});
