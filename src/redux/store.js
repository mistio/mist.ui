import { configureStore } from '@reduxjs/toolkit';

// import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

import configReducer from './slices/config.js';
import sectionsReducer from './slices/sections.js';
import orgReducer from './slices/org.js';

export const store = configureStore({
  reducer: {
    config: configReducer,
    sections: sectionsReducer,
    org: orgReducer,
  },
});
