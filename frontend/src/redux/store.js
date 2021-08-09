import { configureStore } from '@reduxjs/toolkit';
import LoggedInReduer from './reducers/loggedInReducer';
import PageReducer from './reducers/pageReducer';
import WalletModalReducer from './reducers/walletModalReducer';
import ProjectModalReducer from './reducers/projectModalReducer';
import DonationThankYouModalReducer from './reducers/donationThankYouModalReducer';
import CreateNewProjectModalReducer from './reducers/createNewProjectModalReducer';
import CreateNewRequestModalReducer from './reducers/createNewRequestModalReducer';

export default configureStore({
    reducer: {
        loggedIn: LoggedInReduer,
        page: PageReducer,
        walletModal: WalletModalReducer,
        projectModal: ProjectModalReducer,
        donationThankYouModal: DonationThankYouModalReducer,
        createNewProjectModal: CreateNewProjectModalReducer,
        createNewRequestModal: CreateNewRequestModalReducer
    }
})