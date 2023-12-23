import { createSlice } from "@reduxjs/toolkit";

const selectCommandesSlice = createSlice({
    name: "selectCommandes",
    initialState: {
        value: {
            commandes: null,
        },
    },
    reducers: {
        setCommandes: (state, action) => {
            state.value.commandes = action.payload;
        }
    }
});

export const {setCommandes} = selectCommandesSlice.actions;
export default selectCommandesSlice.reducer;
