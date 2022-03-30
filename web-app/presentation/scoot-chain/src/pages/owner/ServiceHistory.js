import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import ServiceTable from './ServiceTable';

const ServiceHistory = () => {

	const [serialNumber, setSerialNumber] = useState('');
	const [services, setServices] = useState([]);

	const handleServiceHistory = async (e) => {
		e.preventDefault();
		const token  = JSON.parse(localStorage.getItem('authToken'));
		
		try {
			const response = await axios.post('/scooter/GetAssetServiceHistory', JSON.stringify({ serialNumber }),
			{
				headers: { 	'Content-Type': 'application/json',
									  'authToken': token
				}
			});
		setServices(response.data);
		toast.success('E-Scooter Service History Retrieved');
		} catch(err){
			if(err.response?.status === 405){
				toast.error('E-Scooter Not Found');
			}
		}
	}

  return (
    <div className='serviceHistory'>
			<form className='historyForm' onSubmit={handleServiceHistory}>
        <input 
            type='text'
            placeholder='Enter E-Scooter Serial Number'
						onChange={(e) => setSerialNumber(e.target.value)}
						value={serialNumber}
						required 
        />
				<button 
					id='searchButton'
					type='submit'
				>
						Submit
				</button>
			</form>

			<ServiceTable services={services} />
    </div>
  )
}

export default ServiceHistory