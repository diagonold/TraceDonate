import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoggedIn, setNotLoggedIn } from '../redux/reducers/loggedInReducer';
import { useHistory } from 'react-router-dom';
import BlockchainServices from '../services/Blockchain';
import LocalStorageUtil from '../utils/LocalStorage';

import ProjectIndex from '../components/projects/Index';
import MyProjectIndex from '../components/projects/my_projects/Index';
import TransactionIndex from '../components/transactions/Index';
import Wallet from '../components/Wallet';
import ProjectDetails from '../components/projects/ProjectDetails';
import DonationThankYou from '../components/projects/DonationThankYou';
import CreateNewProject from '../components/projects/my_projects/CreateNewProject';
import CreateNewRequest from '../components/projects/my_projects/CreateNewRequest';

export default function Home() {

	const history = useHistory();

	const dispatch = useDispatch();

	const page = useSelector((state) => state.page.value);

	const wallet = useSelector((state) => state.walletModal.value);

	const projectDetails = useSelector((state) => state.projectModal.opened);

	const donationThankYou = useSelector((state) => state.donationThankYouModal.opened);

	const createNewProject = useSelector((state) => state.createNewProjectModal.value);

	const createNewRequest = useSelector((state) => state.createNewRequestModal.value);

	useEffect(() => {
		(async () => {
			const token = LocalStorageUtil.read("token");
			if (typeof token === "string") {
				const blockchainServices = new BlockchainServices(token);
				try {
					const response = await blockchainServices.getProjects();
					if (response.status === 200) {
						dispatch(setLoggedIn());
						console.log("Active session");
						const myWallet = await blockchainServices.getWallet();
						if (myWallet.status === 200) {
							LocalStorageUtil.create("TraceDonateWallet", myWallet.data.wallet);
						}
					} 
				} catch(err) {
					dispatch(setNotLoggedIn());
					console.log("No active session");
					LocalStorageUtil.remove("token");
					LocalStorageUtil.remove("TraceDonateUsername");
					LocalStorageUtil.remove("TraceDonateWallet");
					history.push("/login");
					history.go(0);
				} 
			} else {
				history.push("/login");
				history.go(0);
			}
		})();
	}, []);

    return (
		<>
		{ wallet && (
			<Wallet />
		)}
		{ projectDetails && (
			<ProjectDetails />
		)}
		{ donationThankYou && (
			<DonationThankYou />
		)}
		{ createNewProject && (
			<CreateNewProject />
		)}
		{ createNewRequest && (
			<CreateNewRequest />
		)}
		{ page === 1 && (
			<ProjectIndex />
		)}
		{ page === 2 && (
			<TransactionIndex />
		)}
		{ page === 3 && (
			<MyProjectIndex />
		)}
		</>
    );
}