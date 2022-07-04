import { createSlice } from "@reduxjs/toolkit";

const orgSlice = createSlice({
  name: "org",
  initialState: {},
  reducers: {
    sectionUpdated(state, action) {
      // Init new state with old state values
      const ret = {
        ...state
      };
      const target = `${action.payload.meta.kind}`;
      // Convert result list to map by ID
      const oldMap = state[target] && state[target].data && state[target].data.obj || {};
      const newMap = {};
      action.payload.data.forEach(x => {newMap[x.id]=x});

      // Update section with new results
      ret[target] = {
        data: {
          // Keep the items as a list. Only include current response
          arr: action.payload.data,
          // Update map of items, Include old and new.
          obj: {...oldMap, ...newMap}
        },
        meta: {
          total: action.payload.meta.total
        }
      }
      // Count all locally saved items in the returned count
      ret[target].meta.returned = Object.keys(ret[target].data.obj).length

      return ret;
    },
    orgUpdated(state, action) {
      const org = action.payload.data;
      const newState = {
        id: org.id,
        name: org.id
      };
      if (org.billing) {
        newState.billing = action.payload.billing;
      }
      if (org.resources) {
        Object.keys(org.resources).forEach((section) => {
          if (newState[section] === undefined) {
            newState[section] = { meta: {} };
          }
          if (org.resources[section]) {
            newState[section].meta.total = org.resources[section].total || 0;
          }
        });
      }
      return newState;
    }
  }
});

export const { orgUpdated, sectionUpdated } = orgSlice.actions;
export default orgSlice.reducer;
