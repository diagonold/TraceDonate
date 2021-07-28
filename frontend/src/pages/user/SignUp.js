import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthServices from '../../services/Auth';

import { signUpSchema } from '../../schema/User';

import WelcomeTitles from '../../components/WelcomeTitles';

const authServices = new AuthServices();

export default function SignUp() {

	const history = useHistory();

	const {
		register,
		formState: { 
			errors 
		}, handleSubmit
	} = useForm({ resolver: yupResolver(signUpSchema) });
    
    const onSubmitRegister = async (payload) => {
        try {
			const response = await authServices.register(payload);
			if (response.status === 201) {
				alert("Successfully registering new account")
				history.push("/login");
			}
        } catch(err) {
            console.log(err);
            alert("Error registering new account, please try again!");
        } finally {
			history.go(0);
		}
    } 
	
    return (
        <div class="container-fluid mt-5">
            <WelcomeTitles />
            <form onSubmit={handleSubmit(onSubmitRegister)}>
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
                <div className="form-group">
					<label className="text-dark">Confirm Password: </label>
					<input type="password" {...register("confirmPassword")} />
					<div className="error text-danger">{errors.confirmPassword?.message}</div>
				</div>
				<input className="btn btn-primary" type="submit" value="Sign Up" />
        	</form>
        </div>
    );
}