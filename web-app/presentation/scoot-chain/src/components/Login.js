import React from 'react'
import {  useState } from 'react';
import axios from '../api/axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {

	const navigate = useNavigate();

	// Creating state for the password/email
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginSubmit = async (e) => {
		e.preventDefault();
		
		try {

			// API call to URI authentication URI endpoint
			const response = await axios.post('/user/Login', JSON.stringify({email, password}), 
			{
				headers: { 'Content-Type': 'application/json' }
				//withCredentials: true
			});
			// Retrieve the JWT from the response
			const authToken = JSON.stringify(response.data);
			
			// Decode the JWT using jwt-decode package
			const decoded = jwt_decode(authToken);
			
			// Check the users role which is stored in the JWT 
			const role = decoded.Role;

			// Set the JWT in Local Storage
			localStorage.setItem('authToken', authToken);
			
			// Redirect the user to their role based screen using navigate
			if(role === 'owner'){
				navigate('/createRequest');
			} else if(role === 'retailer'){
				navigate('/registerScooter');
			} else if(role === 'law'){
				navigate('/viewStolen');
			} else if(role === 'servicer'){
				navigate('/createService');
			} else if(role === 'registrar'){
				navigate('/createUser');
			}
			// Reset the Login form with empty fields
			toast.success('Login Successful');
			setEmail('');
			setPassword('');
		} catch(err) {
			if(err.response?.status === 403){
				toast.error('Invalid Credentials')
			} else if (err.response?.status === 401){
				toast.error('Invalid Credentials')
			}
		}
	}

  return (
    <div className='lform-container'>
			<form id='login-form' onSubmit={handleLoginSubmit}>
				<h1>ScootChain Login</h1>
				<label htmlFor='email'>Email:</label>
				<input 
					type='text' 
					id='email' 
					placeholder='Enter Email' 
					onChange={(e) => setEmail(e.target.value)}
					value={email} 
					required />
				<label htmlFor='password'>Password:</label>
				<input 
					type='password'
					id='password'
					placeholder='Enter Password' 
					onChange={(e) => setPassword(e.target.value)}
					value={password} 
					required
				/>
				<button
					id='loginButton'
				>
					Login
				</button>
			</form>
		</div>
  )
}

export default Login