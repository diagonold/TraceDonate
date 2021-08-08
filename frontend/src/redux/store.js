import { configureStore } from '@reduxjs/toolkit';
import LoggedInReduer from './reducers/loggedInReducer';
import PageReducer from './reducers/pageReducer';
import WalletModalReducer from './reducers/walletModalReducer';

export default configureStore({
    reducer: {
        loggedIn: LoggedInReduer,
        page: PageReducer,
        walletModal: WalletModalReducer
    }
})