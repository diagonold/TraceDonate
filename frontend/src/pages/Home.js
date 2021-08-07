import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoggedIn, setNotLoggedIn } from '../redux/reducers/loggedInReducer';
import { useHistory } from 'react-router-dom';
import BlockchainServices from '../services/Blockchain';
import LocalStorageUtil from '../utils/LocalStorage';

import OrganizationIndex from '../components/organizations/Index';
import TransactionIndex from '../components/transactions/Index';
import Wallet from '../components/Wallet';

export default function Home() {

	const history = useHistory();

	const dispatch = useDispatch();

	const loggedIn = useSelector((state) => state.loggedIn.value)

	const page = useSelector((state) => state.page.value);

	const wallet = useSelector((state) => state.walletModal.value);

	useEffect(() => {
		(async () => {
			const token = LocalStorageUtil.read("token");
			if (token) {
				const blockchainServices = new BlockchainServices();
				try {
					const response = await blockchainServices.getOrganizations();
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
			}
		})();
	}, []);

    return (
		<>
		{ wallet && (
			<Wallet />
		)}
		{ page === 1 && (
			<OrganizationIndex />
		)}
		{ page === 2 && (
			<TransactionIndex />
		)}
		</>
    );
}