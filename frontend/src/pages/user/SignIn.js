import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

export default function SignIn() {

	const {
		register,
		handleSubmit,
		errors
	} = useForm();

	const history = useHistory();

	const onSubmitLogin = async (payload) => {

	}

    return (
    	<div class="container-fluid mt-5">
        	<h1>TraceDonate</h1>
        	<h3>You know what it is about</h3>
        	<form onSubmit={handleSubmit(onSubmitLogin)}>
				<div className="form-group">
					<label className="text-dark">Username: </label>
				</div>
				<div className="form-group">
					<label className="text-dark">Password: </label>
				</div>
        	</form>
        </div>
    );
}