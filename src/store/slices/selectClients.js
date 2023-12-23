import {createSlice} from '@reduxjs/toolkit';
const selectClientsSlice = createSlice({
    name:'selectClients',
    initialState: {
        value: {
           clients: null,
        }
    },
    reducers:{
        setClients: (state, action) => {
            state.value.clients = action.payload;
        }
    }
});
export const {setClients} = selectClientsSlice.actions;
export default selectClientsSlice.reducer;
