import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';
import AuthServices from '../../services/Auth';
import LocalStorageutil from '../../utils/LocalStorage';

import WelcomeTitles from '../../components/WelcomeTitles';

import { signInSchema } from '../../schema/User';

const authServices = new AuthServices();

export default function SignIn() {

	const {
		register,
		formState: { 
			errors 
		}, handleSubmit
	} = useForm({resolver: yupResolver(signInSchema) });

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
			<WelcomeTitles />
        	<form onSubmit={handleSubmit(onSubmitLogin)}>
				<div className="form-group">
					<label className="text-dark">Username: </label>
					<input type="text" {...register("username")} />
                    <div className="error text-danger">{errors.username?.message}</div>
				</div>
				<div className="form-group">
					<label className="text-dark">Password: </label>
					<input type="password" {...register("password")} />
					<div className="error text-danger">{errors.password?.message}</div>
				</div>
				<input className="btn btn-primary" type="submit" value="Sign In" />
        	</form>
        </div>
    );
}