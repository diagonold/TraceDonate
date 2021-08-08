import { createSlice } from '@reduxjs/toolkit';

const walletModalSlice = createSlice({
    name: "walletModal",
    initialState: {
        value: false
    },
    reducers: {
        setWalletModalOpened: (state) => {
            state.value = true
        },
        setWalletModalClosed: (state) => {
            state.value = false
        } 
    }
});

export const { setWalletModalOpened, setWalletModalClosed } = walletModalSlice.actions;

export default walletModalSlice.reducer;