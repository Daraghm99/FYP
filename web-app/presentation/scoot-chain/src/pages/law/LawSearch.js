import React from 'react'
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const LawSearch = () => {

	const [serialNumber, setSerialNumber] = useState();

	const handleLawSearch = async (e) => {
		e.preventDefault();
		const token  = JSON.parse(localStorage.getItem('authToken'));
		
		try {
			const response = await axios.post('/scooter/ReviewScooter', JSON.stringify({ serialNumber }),
			{
				headers: 
				{ 	
					'Content-Type': 'application/json',
					'authToken': token
				}
			});
			toast.success('E-Scooter Info Retrieved');
			alert('Manufacturer: ' + response.data.Manufacturer + '\n' +
						'Model: ' + response.data.Model + '\n' + 
						'Owner: ' + response.data.Owner + '\n' +
						'Retailer: ' + response.data.Retailer + '\n' +
						'State: ' + response.data.State + '\n' + 
						'Status: ' + response.data.Status);
		} catch(err){
			if(err.response?.status === 405){
				toast.error('E-Scooter Not Found');
			}
		}
	}

  return (
    <div className='lawSearch'>
			<form className='reviewForm' onSubmit={handleLawSearch}>
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
						<FaSearch />
				</button>
			</form>
    </div>
  )
}

export default LawSearch