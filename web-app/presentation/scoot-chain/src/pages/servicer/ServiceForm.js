import React from 'react';
import { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const ServiceForm = () => {

	const [serialNumber, setSerialNumber] = useState('');
	const [serviceDescription, setServiceDescription] = useState('');
	const [serviceType, setServiceType] = useState('Upgrade');
	const [serviceDate, setServiceDate] = useState('');

	const handleServiceSubmit = async (e) => {
		e.preventDefault();
		const token  = JSON.parse(localStorage.getItem('authToken'));

		try {
			const response = await axios.post('/service/CreateAssetService', JSON.stringify({ serialNumber, serviceType, serviceDate, serviceDescription }),
			{
				headers: 
				{ 	
					'Content-Type': 'application/json',
					'authToken': token
				}
			});
		console.log(response);
		toast.success('Service Added Succesfully');
		setSerialNumber('');
		setServiceType('Upgrade');
		setServiceDescription('');
		setServiceDate('');
		} catch(err){
			if(err.response?.status === 405){
				toast.error('E-Scooter Not Found');
			} else if (err.response?.status === 406) {
				toast.error('E-Scooter Not Registered');
			}
		}
	}

  return (
		<div className='form-container'>
			<form className='serviceForm' onSubmit={handleServiceSubmit}>
				<h1>E-Scooter Service Form</h1>
				<p>Enter details relating to the service carried out on the E-Scooter</p>
				<label htmlFor='serialNumber'>Serial Number:</label>
					<input 
						type='text' 
						id='serialNumber' 
						placeholder='Enter Serial Number' 
						onChange={(e) => setSerialNumber(e.target.value)}
						value={serialNumber} 
						required />
				<label htmlFor='type'>Service Type:</label>
					<select 
						name='serviceType'
						id='serviceType'
						onChange={(e) => setServiceType(e.target.value)}
						value={serviceType}
						required
					>
						<option value='Upgrade'>Upgrade</option>
						<option value='Repair'>Repair</option>
					</select>
				<label htmlFor='serviceDate'>Service Date:</label>
					<input 
						type='date' 
						id='serviceDate'  
						onChange={(e) => setServiceDate(e.target.value)}
						value={serviceDate} 
						required 
					/>
				<label htmlFor="serviceDescription">Service Description:</label>
					<textarea
						id="serviceDescription"
						placeholder='Enter Service Details' 
						onChange={(e) => setServiceDescription(e.target.value)}
						value={serviceDescription}
						required
					/>
				<button type="submit">Submit</button>
		</form>
	</div>
  )
}

export default ServiceForm