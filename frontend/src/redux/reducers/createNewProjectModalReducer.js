import { createSlice } from '@reduxjs/toolkit';

const createNewProjectModalSlice = createSlice({
    name: "createNewProjectModal",
    initialState: {
        value: false
    },
    reducers: {
        setCreateNewProjectModalOpened: (state) => {
            state.value = true
        },
        setCreateNewProjectModalClosed: (state) => {
            state.value = false
        } 
    }
});

export const { setCreateNewProjectModalOpened, setCreateNewProjectModalClosed } = createNewProjectModalSlice.actions;

export default createNewProjectModalSlice.reducer;