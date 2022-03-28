import React from 'react'
import { useState } from 'react';
import axios from '../../api/axios';

const RequestForm = () => {

	const [serialNumber, setSerialNumber] = useState('');
	const [manufacturer, setManufacturer] = useState('');
	const [model, setModel] = useState('');
	const [retailer, setRetailer] = useState('');


	const handleRequestSubmit = async (e) => {

		e.preventDefault();
		const token  = JSON.parse(localStorage.getItem('authToken'));
		console.log(token); 
		try {
			const response = await axios.post('/scooter/CreateAssetRequest', JSON.stringify({ serialNumber, manufacturer, model, retailer }),
			{
				headers: { 	'Content-Type': 'application/json',
									  'authToken': token
				}
			});

		console.log(response);
		} catch(err){
			console.log(err);
		}
	}

  return (
    <div id='request-container'>
        <form id='request-form' onSubmit={handleRequestSubmit}>
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
						Submit	
					</button>
        </form>
    </div>
  )
}

export default RequestForm