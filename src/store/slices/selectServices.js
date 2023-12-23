import { createSlice } from "@reduxjs/toolkit";
const selectServicesSlice = createSlice({
    name: "selectServices",
    initialState: {
        value: {
            services: null,
        },
    },
    reducers: {
        setServices: (state, action) => {
            state.value.services= action.payload;
        }
    }
});
export const {setServices} = selectServicesSlice.actions;
export default selectServicesSlice.reducer;