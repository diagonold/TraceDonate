import { createSlice } from '@reduxjs/toolkit';

const loadingSpinnerOverlaySlice = createSlice({
    name: "loadingSpinnerOverlay",
    initialState: {
        value: false
    },
    reducers: {
        setLoadingSpinnerOverlayShown: (state) => {
            state.value = true
        },
        setLoadingSpinnerOverlayNotShown: (state) => {
            state.value = false
        } 
    }
});

export const { setLoadingSpinnerOverlayShown, setLoadingSpinnerOverlayNotShown } = loadingSpinnerOverlaySlice.actions;

export default loadingSpinnerOverlaySlice.reducer;