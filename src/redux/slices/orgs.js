import { createSlice } from '@reduxjs/toolkit';

const orgsSlice = createSlice({
  name: 'orgs',
  initialState: {},
  reducers: {
    orgsUpdated(state, action) {
      return {
        ...action.payload,
      };
    },
  },
});

export const { orgsUpdated } = orgsSlice.actions;
export default orgsSlice.reducer;
