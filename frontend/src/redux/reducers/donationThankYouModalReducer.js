import { createSlice } from '@reduxjs/toolkit';

const donationThankYouModalSlice = createSlice({
    name: "donationThankYouModal",
    initialState: {
        opened: false,
        data: {
            "receiver": "",
            "amount": 0
        }
    },
    reducers: {
        setDonationThankYouModalOpened: (state, action) => {
            state.opened = true;
            state.data = action.payload
        },
        setDonationThankYouModalClosed: (state) => {
            state.opened = false
        } 
    }
});

export const { setDonationThankYouModalOpened, setDonationThankYouModalClosed } = donationThankYouModalSlice.actions;

export default donationThankYouModalSlice.reducer;