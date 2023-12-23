import { createSlice } from "@reduxjs/toolkit"


const waiting = createSlice({
    name:"waiting",
    initialState: {
        value:false
    },
    reducers:{
        setWaiting: (state, action) => {
            state.value = action.payload
        }
    }
})

export const {setWaiting} = waiting.actions
export default waiting.reducer