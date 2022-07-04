import { createSlice } from '@reduxjs/toolkit'

const cloudsSlice = createSlice({
    name: 'clouds',
    initialState: {},
    reducers: {
      cloudsUpdated(state, action) {
        return {
            ...action.payload
        }
      }
    }
  })
  
  export const { cloudsUpdated } = cloudsSlice.actions
  export default cloudsSlice.reducer