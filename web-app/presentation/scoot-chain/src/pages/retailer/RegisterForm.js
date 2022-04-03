import React from 'react';
import { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

const RegisterForm = () => {

	const [serialNumber, setSerialNumber] = useState('');
	const [manufacturer, setManufacturer] = useState('');
	const [model, setModel] = useState('');
	const [owner, setOwner] = useState('');

	const handleRegister = async (e) => {
		e.preventDefault();

		const token  = JSON.parse(localStorage.getItem('authToken'));

		try {
			const response = await axios.post('/scooter/RegisterAsset', JSON.stringify({ serialNumber, manufacturer, model, owner }),
			{
				headers: 
				{ 	
					'Content-Type': 'application/json',
					'authToken': token
				}
			});
			console.log(response);
			toast.success('E-Scooter Registered');
			setSerialNumber('');
			setManufacturer('');
			setModel('');
			setOwner('');
		} catch (err) {
			if(err.response?.status === 405){
				toast.error('E-Scooter Already Recorded');
			} else if (err.response?.status === 406){
				toast.error('Owner not Found');
			} else if (err.response?.status === 407){
				toast.error('Cannot Register to User');
			}
		}
	}

  return (
		<div className='form-container'>
			<h1>E-Scooter Registration Form</h1>
			<p>Enter All Details of the E-Scooter you are Registering</p>
			<form className='registerForm' onSubmit={handleRegister}>
				<label htmlFor='serialNumber'>SerialNumber:</label>
					<input 
						type='text' 
						id='serialNumber' 
						placeholder='Enter Serial Number' 
						onChange={(e) => setSerialNumber(e.target.value)}
						value={serialNumber} 
						required 
					/>
				<label htmlFor='maufacturer'>Manufacturer:</label>
					<input 
						type='text' 
						id='manufacturer' 
						placeholder='Enter Manufacturer' 
						onChange={(e) => setManufacturer(e.target.value)}
						value={manufacturer} 
						required 
					/>
				<label htmlFor='model'>Model:</label>
					<input 
						type='text' 
						id='model' 
						placeholder='Enter Model' 
						onChange={(e) => setModel(e.target.value)}
						value={model} 
						required 
					/>
				<label htmlFor='owner'>Owner:</label>
					<input 
						type='text'
						id='owner'
						placeholder='Enter Owner'
						onChange={(e) => setOwner(e.target.value)}
						value={owner}
						required
					/>
				<button
						id='submitButton'
					>
						Register <FaPlus />	
					</button>
			</form>
		</div>
  )
}

export default RegisterForm