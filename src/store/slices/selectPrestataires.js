import { createSlice } from "@reduxjs/toolkit";
const selectPrestatairesSlice = createSlice({
    name: "selectPrestataires",
    initialState: {
        value: {
            prestataires: null,   
        },
    },
    reducers: {
        setPrestataires: (state, action) => {
            state.value.prestataires = action.payload;
        }
    }
});
export const {setPrestataires} = selectPrestatairesSlice.actions;
export default selectPrestatairesSlice.reducer;