import React from 'react'
import { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

const RequestForm = () => {

	const [serialNumber, setSerialNumber] = useState('');
	const [manufacturer, setManufacturer] = useState('');
	const [model, setModel] = useState('');
	const [retailer, setRetailer] = useState('');


	const handleRequestSubmit = async (e) => {
		e.preventDefault();
		const token  = JSON.parse(localStorage.getItem('authToken'));

		try {
			const response = await axios.post('/scooter/CreateAssetRequest', JSON.stringify({ serialNumber, manufacturer, model, retailer }),
			{
				headers: 
				{ 	
					'Content-Type': 'application/json',
					'authToken': token
				}
			});
			console.log(response);
			toast.success('E-Scooter Request Created');
			setSerialNumber('');
			setManufacturer('');
			setModel('');
			setRetailer('');
		} catch(err){
			if(err.response?.status === 409){
				toast.error('E-Scooter Already Registered!');
			} else if (err.response?.status === 410){
				toast.error('Retailer Not Found');
			}
		}
	}

  return (
		<div className='form-container'>
			<h1>E-Scooter Request Registration Form</h1>
			<p>Enter All Details of the E-Scooter you wish to Register!</p>
			<form className='requestForm' onSubmit={handleRequestSubmit}>
				<label htmlFor='serialNumber'>SerialNumber:</label>
					<input 
						type='text' 
						id='serialNumber' 
						placeholder='Enter Serial Number' 
						onChange={(e) => setSerialNumber(e.target.value)}
						value={serialNumber} 
						required />
					<label htmlFor='maufacturer'>Manufacturer:</label>
						<input 
							type='text' 
							id='manufacturer' 
							placeholder='Enter Manufacturer' 
							onChange={(e) => setManufacturer(e.target.value)}
							value={manufacturer} 
							required />
					<label htmlFor='model'>Model:</label>
						<input 
							type='text' 
							id='model' 
							placeholder='Enter Model' 
							onChange={(e) => setModel(e.target.value)}
							value={model} 
							required />
						<label htmlFor='retailer'>Retailer:</label>
						<input 
							type='text' 
							id='retailer' 
							placeholder='Enter Retailer' 
							onChange={(e) => setRetailer(e.target.value)}
							value={retailer} 
							required />
						<button
							id='submitButton'
						>
							Submit <FaPlus />	
						</button>
					</form>
				</div>
  )
}

export default RequestForm