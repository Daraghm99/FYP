import React from 'react'
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from './context/AuthProvider';
import axios from './api/axios';

const Login = () => {

	const {setAuth} = useContext(AuthContext);
	
	const userRef = useRef();

	// Creating state for the password/email
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [success, setSuccess] = useState(false);

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
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			});
			console.log(JSON.stringify(response.data));
			const authToken = response.data.authToken;
			// Check the users role which is stored in the JWT 
			const role = authToken.Role;
			setAuth({ email, password, role, authToken });
			setSuccess(true);
			console.log(success);
			// Reset the Login form with empty fields
			setEmail('');
			setPassword('');
		} catch(err) {
			if(err.response.status === 403){
				console.log('Incorrect Email');
			} else if (err.response.status === 401){
				console.log('Incorrect Password');
			}
		}
	}

  return (
    <section>
			<h1>ScootChain Login</h1>
			<form onSubmit={handleLoginSubmit}>
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