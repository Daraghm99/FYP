import React from 'react'
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from '../../api/axios';

const OwnerSearch = () => {

	const [serialNumber, setSerialNumber] = useState();

	const handleOwnerSearch = async (e) => {
		e.preventDefault();
		const token  = JSON.parse(localStorage.getItem('authToken'));
		
		try {
			const response = await axios.post('/scooter/GetAssetStatus', JSON.stringify({ serialNumber }),
			{
				headers: { 	'Content-Type': 'application/json',
									  'authToken': token
				}
			});
		alert('The E-Scooter Status is ' + response.data);
		} catch(err){
			console.log(err);
		}
	}
	
  return (
    <div className='ownerSearch'>
			<form className='requestForm' onSubmit={handleOwnerSearch}>
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

export default OwnerSearch