import { createSlice } from '@reduxjs/toolkit';

const orgSlice = createSlice({
  name: 'org',
  initialState: {},
  reducers: {
    sectionUpdated(state, action) {
      const ret = {
        ...state,
      };
      ret[`${action.payload.meta.kind}s`] = { ...action.payload };
      return ret;
    },
    orgUpdated(state, action) {
      const newState = { ...state };
      Object.values(action.payload).forEach(section => {
        newState[section.id].meta.total = section.total;
      });
      return newState;
    },
  },
});

export const { orgUpdated, sectionUpdated } = orgSlice.actions;
export default orgSlice.reducer;
