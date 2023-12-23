import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
    name:'auth',
    initialState: {
        value:{
            token:localStorage.getItem('token'),
            user:JSON.parse(localStorage.getItem('user')) || null
        }
    },
    reducers:{
        setToken: (state, action) => {
            state.value.token = action.payload;
        },
        setUser: (state, action) => {
            state.value.user = action.payload;
        },
        logout: (state) => {
            state.value.token = null;
            state.value.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
})
export const {setToken} = authSlice.actions;
export const {setUser} = authSlice.actions;
export const {logout} = authSlice.actions;
export default authSlice.reducer;