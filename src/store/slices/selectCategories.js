import {createSlice} from '@reduxjs/toolkit';
const selectCategoriesSlice = createSlice({
    name:'selectCategories',
    initialState: {
        value: {
            categories: null,
        }
    },
    reducers:{
        setCategories: (state, action) => {
            state.value.categories = action.payload;
        }
    }
});
export const {setCategories} = selectCategoriesSlice.actions;
export default selectCategoriesSlice.reducer;