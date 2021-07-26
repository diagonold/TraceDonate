import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import AuthServices from '../../services/Auth';
import BlockchainServices from '../../services/Blockchain';
import LocalStorageutil from '../../utils/LocalStorage';

const authServices = new AuthServices();

export default function SignIn() {

	useEffect(() => {
		(async () => {
			const token = LocalStorageutil.read("token");
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
					LocalStorageutil.remove("token");
				} 
			}
		})();
	}, []);

	const {
		register,
		formState: { 
			errors 
		}, handleSubmit
	} = useForm();

	const history = useHistory();

	const onSubmitLogin = async (payload) => {
		try {
			const response = await authServices.login(payload);
			if (response.status === 201) {
				const token = response.data.token;
				LocalStorageutil.create("token", token);
				history.push("/");
			}
		} catch(err) {
			alert("Error signning in");
		}
	}

    return (
    	<div class="container-fluid mt-5">
        	<h1>TraceDonate</h1>
        	<h3>You know what it is about</h3>
        	<form onSubmit={handleSubmit(onSubmitLogin)}>
				<div className="form-group">
					<label className="text-dark">Username: </label>
					<input type="text" {...register("username", {required: { value: true }})} />
                    <div className="error text-danger">{errors.username?.type === "required" && "Must input username"}</div>
				</div>
				<div className="form-group">
					<label className="text-dark">Password: </label>
					<input type="password" {...register("password", {required: { value: true }})} />
					<div className="error text-danger">{errors.password?.type === "required" && "Must input password"}</div>
				</div>
				<input className="btn btn-primary" type="submit" value="Sign In" />
        	</form>
        </div>
    );
}