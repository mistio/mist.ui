import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'config',
  initialState: {},
  reducers: {
    configUpdated(state, action) {
      return {
        ...action.payload,
      };
    },
  },
});

export const { configUpdated } = configSlice.actions;
export default configSlice.reducer;
