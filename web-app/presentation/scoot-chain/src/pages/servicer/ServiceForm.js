import React from 'react';
import { useState } from 'react';
import axios from '../../api/axios';

const ServiceForm = () => {

	const [serialNumber, setSerialNumber] = useState('');
	const [serviceDescription, setServiceDescription] = useState('');

	const handleServiceSubmit = async (e) => {
		e.preventDefault();
		const token  = JSON.parse(localStorage.getItem('authToken'));

		try {
			const response = await axios.post('/service/CreateAssetService', JSON.stringify({ serialNumber, serviceDescription }),
			{
				headers: { 	'Content-Type': 'application/json',
									  'authToken': token
				}
			});
		alert('Service Number: ' + response.data.SID + 'Added Successfuly');
		setSerialNumber('');
		setServiceDescription('');
		} catch(err){
			console.log(err);
		}
	}

  return (
    <form className='serviceForm' onSubmit={handleServiceSubmit}>
			<h1>E-Scooter Service Form</h1>
			<p>Enter details relating to the service carried out on the E-Scooter</p>
			<label htmlFor='serialNumber'>SerialNumber:</label>
				<input 
					type='text' 
					id='serialNumber' 
					placeholder='Enter Serial Number' 
					onChange={(e) => setSerialNumber(e.target.value)}
					value={serialNumber} 
					required />
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
  )
}

export default ServiceForm