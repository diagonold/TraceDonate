import { createSlice } from '@reduxjs/toolkit';

const projectModalSlice = createSlice({
    name: "projectModal",
    initialState: {
        opened: false,
        data: {
            donations: {},
            requests: [],
            project_address: "",
            owner: "",
            raisedDonation: 0,
            participated: false
        }
    },
    reducers: {
        setProjectModalOpened: (state, action) => {
            state.opened = true;
            state.data = action.payload
        },
        setProjectModalClosed: (state) => {
            state.opened = false
        } 
    }
});

export const { setProjectModalOpened, setProjectModalClosed } = projectModalSlice.actions;

export default projectModalSlice.reducer;