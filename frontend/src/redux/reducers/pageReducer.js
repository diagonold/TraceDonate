import { createSlice } from '@reduxjs/toolkit';

const pageSlice = createSlice({
    name: "page",
    initialState: {
        value: 1
    },
    reducers: {
        changeToPage1: (state) => {
            state.value = 1
        },
        changeToPage2: (state) => {
            state.value = 2
        },
        changeToPage3: (state) => {
            state.value = 3
        }
    }
});

export const { changeToPage1, changeToPage2, changeToPage3 } = pageSlice.actions;

export default pageSlice.reducer;