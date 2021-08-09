import React from 'react';
import { Link, useHistory } from 'react-router-dom';
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
		<>
		<WelcomeTitles />
        <div class="container-fluid mt-2 w-25">
			<br/>
            <form onSubmit={handleSubmit(onSubmitRegister)}>
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
				<br/>
                <div className="form-group text-start">
					<label className="text-dark form-label">Confirm Password: </label>
					<br/>
					<input type="password" className="form-control" {...register("confirmPassword")} />
					<div className="error text-danger">{errors.confirmPassword?.message}</div>
				</div>
				<p className="text-end">Already have an account? <Link to="/login" style={{textDecoration: "none"}}>Sign In</Link> here!</p>
				<br/>
				<input className="btn btn-primary" type="submit" value="Sign Up" />
        	</form>
        </div>
		</>
    );
}