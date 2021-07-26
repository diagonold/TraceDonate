import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthServices from '../services/Auth';
import LocalStorageUtil from '../utils/LocalStorage';

const authServices = new AuthServices();

export default function Home() {

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