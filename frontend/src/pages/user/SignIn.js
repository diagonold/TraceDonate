import React from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '../../redux/reducers/loggedInReducer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useHistory } from 'react-router-dom';
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

	const dispatch = useDispatch();

	const history = useHistory();

	const onSubmitLogin = async (payload) => {
		try {
			const response = await authServices.login(payload);
			if (response.status === 200) {
				const token = response.data.token;
				const username = response.data.username;
				LocalStorageutil.create("token", token);
				LocalStorageutil.create("TraceDonateUsername", username);
				dispatch(setLoggedIn());
				history.push("/");
				history.go(0);
			}
		} catch(err) {
			alert("Error signning in");
		}
	}

    return (
		<>
		<WelcomeTitles />
    	<div class="container-md mt-4 w-25">
        	<form onSubmit={handleSubmit(onSubmitLogin)}>
				<div className="form-group text-start">
					<label className="text-dark form-label">Username: </label>
					<br/>
					<input type="text" className="form-control" {...register("username")} />
                    <div className="error text-danger">{errors.username?.message}</div>
				</div>
				<br/>
				<div className="form-group text-start">
					<label className="text-dark form-label">Password: </label>
					<br/>
					<input type="password" className="form-control" {...register("password")} />
					<div className="error text-danger">{errors.password?.message}</div>
				</div>
				<p className="text-end">Don't have an account yet? <Link to="/register" style={{textDecoration: "none"}}>Sign up</Link> here!</p>
				<br/>
				<input className="btn btn-primary" type="submit" value="Sign In" />
        	</form>
        </div>
		</>
    );
}