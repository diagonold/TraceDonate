import { createSlice } from '@reduxjs/toolkit';

const createNewRequestModalSlice = createSlice({
    name: "createNewRequestModal",
    initialState: {
        value: false
    },
    reducers: {
        setCreateNewRequestModalOpened: (state) => {
            state.value = true
        },
        setCreateNewRequestModalClosed: (state) => {
            state.value = false
        } 
    }
});

export const { setCreateNewRequestModalOpened, setCreateNewRequestModalClosed } = createNewRequestModalSlice.actions;

export default createNewRequestModalSlice.reducer;