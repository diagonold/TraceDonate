import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoggedIn, setNotLoggedIn } from '../redux/reducers/loggedInReducer';
import { useHistory } from 'react-router-dom';
import BlockchainServices from '../services/Blockchain';
import LocalStorageUtil from '../utils/LocalStorage';

import ProjectIndex from '../components/projects/Index';
import TransactionIndex from '../components/transactions/Index';
import Wallet from '../components/Wallet';
import ProjectDetails from '../components/projects/ProjectDetails';

export default function Home() {

	const history = useHistory();

	const dispatch = useDispatch();

	const loggedIn = useSelector((state) => state.loggedIn.value)

	const page = useSelector((state) => state.page.value);

	const wallet = useSelector((state) => state.walletModal.value);

	const projectDetails = useSelector((state) => state.projectModal.opened);

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
					} 
				} catch(err) {
					dispatch(setNotLoggedIn());
					console.log("No active session");
					LocalStorageUtil.remove("token");
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
		{ page === 1 && (
			<ProjectIndex />
		)}
		{ page === 2 && (
			<TransactionIndex />
		)}
		</>
    );
}