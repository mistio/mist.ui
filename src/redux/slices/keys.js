import { createSlice } from '@reduxjs/toolkit'

const keysSlice = createSlice({
    name: 'keys',
    initialState: {},
    reducers: {
      keysUpdated(state, action) {
        return {
            ...action.payload
        }
      }
    }
  })
  
  export const { keysUpdated } = keysSlice.actions
  export default keysSlice.reducer