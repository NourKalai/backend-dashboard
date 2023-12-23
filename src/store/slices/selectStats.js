import { createSlice } from "@reduxjs/toolkit";
const selectStatsSlice = createSlice({
  name: "selectStats",
  initialState: {
    value: {
      stats: null,
    },
  },
  reducers: {
    setStats: (state, action) => {
      state.value.stats = action.payload;
    }
  }
});
export const {setStats} = selectStatsSlice.actions;
export default selectStatsSlice.reducer;