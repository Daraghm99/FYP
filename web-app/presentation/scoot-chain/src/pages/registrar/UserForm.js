import React from 'react'
import { useState } from 'react';
import axios from '../../api/axios';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserForm = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [role, setRole] = useState('owner');

	const handleUserSubmit = async (e) => {
		e.preventDefault();
		const token  = JSON.parse(localStorage.getItem('authToken'));

		try {
			const response = await axios.post('/user/CreateUser', JSON.stringify({ email, password, name, role }),
			{
				headers: 
				{ 	
					'Content-Type': 'application/json',
					'authToken': token
				}
			});
			toast.success('Participant Added');
			setEmail('');
			setPassword('');
			setName('');
			setRole('owner');
			console.log(response);
		} catch(err){
			if(err.response?.status === 405){
				toast.error('Participant Already Exists');
			} else if (err.response?.status === 406){
				toast.error('Retailer Already Exists');
			}
		}
	}

  return (
    <form className='requestForm' onSubmit={handleUserSubmit}>
			<h1>User Registration Form</h1>
			<p>Register a User onto the Blockchain Network</p>
			<p>Enter All Details to Succesfully Register the User</p>
			<label htmlFor='email'>Email Address:</label>
				<input 
					type='text' 
					id='email' 
					placeholder='Enter Users Email Address' 
					onChange={(e) => setEmail(e.target.value)}
					value={email} 
					required 
				/>
			<label htmlFor='password'>Password:</label>
				<input 
					type='password' 
					id='password' 
					placeholder='Enter Users Password' 
					onChange={(e) => setPassword(e.target.value)}
					value={password} 
					required 
				/>
			<label htmlFor='name'>Name:</label>
				<input 
					type='text' 
					id='name' 
					placeholder='Enter Users Name' 
					onChange={(e) => setName(e.target.value)}
					value={name} 
					required 
				/>
			<label htmlFor='role'>Role:</label>
				<select 
					name='role'
					id='role'
					onChange={(e) => setRole(e.target.value)}
					value={role}
					required
				>
					<option value='owner'>Owner</option>
					<option value='retailer'>Retailer</option>
					<option value='servicer'>Servicer</option>
					<option value='law'>Law Enforcement</option>
				</select>
				
			<button
				id='submitButton'
			>
				Create User	<FaPlus />
			</button>
    </form>
  )
}

export default UserForm