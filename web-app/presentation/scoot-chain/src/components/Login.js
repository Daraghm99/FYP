import React from 'react'
import { useRef, useState, useEffect } from 'react';
import axios from '../api/axios';
import jwt_decode from 'jwt-decode';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {

	const { setAuth } = useAuth();
	
	const userRef = useRef();

	const navigate = useNavigate();

	// Creating state for the password/email
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// Focus on the user input when the form loads
	useEffect(() => {
		userRef.current.focus();
	}, []);

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
			const name = decoded.Name;
			setAuth({ email, name, role, authToken });

			// Set the JWT in Local Storage
			localStorage.setItem('authToken', authToken);
			
			// Redirect the user to their role based screen using navigate
			if(role === 'owner'){
				navigate('/createRequest');
			} else if(role === 'retailer'){
				navigate('/retailer');
			} else if(role === 'law'){
				navigate('/law');
			}
			// Reset the Login form with empty fields
			setEmail('');
			setPassword('');
		} catch(err) {
			if(err.response?.status === 403){
				console.log('Incorrect Email');
			} else if (err.response?.status === 401){
				console.log('Incorrect Password');
			}
		}
	}

  return (
    <section id='login-container'>
			<form id='login-form' onSubmit={handleLoginSubmit}>
				<h1>ScootChain Login</h1>
				<label htmlFor='email'>Email:</label>
				<input 
					type='text' 
					id='email' 
					placeholder='Enter Email' 
					ref={userRef} 
					onChange={(e) => setEmail(e.target.value)}
					value={email} 
					required />
				<label htmlFor='password'>Password:</label>
				<input 
					type='password'
					id='password'
					placeholder='Enter Password' 
					ref={userRef}
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
		</section>
  )
}

export default Login