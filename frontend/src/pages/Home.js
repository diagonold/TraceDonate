import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import BlockchainServices from '../services/Blockchain';
import LocalStorageUtil from '../utils/LocalStorage';

export default function Home() {

	useEffect(() => {
		(async () => {
			const token = LocalStorageUtil.read("token");
			if (token) {
				const blockchainServices = new BlockchainServices();
				try {
					const response = await blockchainServices.getOrganizations();
					if (response.status === 200) {
						console.log("Active session");
						history.push("/");
					}
				} catch(err) {
					console.log("No active session");
					LocalStorageUtil.remove("token");
				} 
			}
		})();
	}, []);

	const history = useHistory();

	useEffect(() => {
		if (!LocalStorageUtil.read("token")) {
			history.push("/login");
		}
	}, []) 

    return (
        <h1>TraceDonate</h1>
    );
}