import {createSlice} from '@reduxjs/toolkit';
const searchBarValueSlice = createSlice({
    name:'searchBarValue',
    initialState: {
        value: {
            searchBarValue: "",
        }
    },
    reducers:{
        setSearchBarValue: (state, action) => {
            state.value.searchBarValue = action.payload;
        }
    }
});
export const {setSearchBarValue} = searchBarValueSlice.actions;
export default searchBarValueSlice.reducer;