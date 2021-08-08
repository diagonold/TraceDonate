import { createSlice } from '@reduxjs/toolkit';

const loggedInSlice = createSlice({
    name: "loggedIn",
    initialState: {
        value: false
    },
    reducers: {
        setLoggedIn: (state) => {
            state.value = true
        },
        setNotLoggedIn: (state) => {
            state.value = false
        } 
    }
});

export const { setLoggedIn, setNotLoggedIn } = loggedInSlice.actions;

export default loggedInSlice.reducer;