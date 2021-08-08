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
        <div class="container-fluid mt-2">
			<br/>
            <form onSubmit={handleSubmit(onSubmitRegister)}>
				<div className="form-group">
					<label className="text-dark">Username: </label>
					<br/>
					<input type="text" {...register("username")} />
                    <div className="error text-danger">{errors.username?.message}</div>
				</div>
				<br/>
				<div className="form-group">
					<label className="text-dark">Password: </label>
					<br/>
					<input type="password" {...register("password")} />
					<div className="error text-danger">{errors.password?.message}</div>
				</div>
				<br/>
                <div className="form-group">
					<label className="text-dark">Confirm Password: </label>
					<br/>
					<input type="password" {...register("confirmPassword")} />
					<div className="error text-danger">{errors.confirmPassword?.message}</div>
				</div>
				<p>Already have an account? <Link to="/login" style={{textDecoration: "none"}}>Sign In</Link> here!</p>
				<input className="btn btn-secondary" type="submit" value="Sign Up" />
        	</form>
        </div>
		</>
    );
}