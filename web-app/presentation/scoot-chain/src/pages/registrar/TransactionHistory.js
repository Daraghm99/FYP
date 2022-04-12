import React from 'react'
import { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import TransactionTable from './TransactionTable';
import { FaSearch } from 'react-icons/fa';

const TransactionHistory = () => {

	const [serialNumber, setSerialNumber] = useState('');
	const [transactions, setTransactions] = useState([]);

	const handleTransactionHistory = async (e) => {
		e.preventDefault();
		const token  = JSON.parse(localStorage.getItem('authToken'));
		
		try {
			const response = await axios.post('/scooter/GetScooterHistory', JSON.stringify({ serialNumber }),
			{
				headers: 
				{ 	
					'Content-Type': 'application/json',
					'authToken': token
				}
			});
			setTransactions(response.data);
			toast.success('E-Scooter Service History Retrieved');
		} catch(err){
			if(err.response?.status === 405){
				toast.error('E-Scooter Not Found');
			}
		}
	}

  return (
    <div className='search-container'>
			<h1>View the History of any Active E-Scooter on the Network</h1>
			<p>Simply Enter its Serial Number below to view its complete history!</p>
			<form className='historyForm' onSubmit={handleTransactionHistory}>
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
			{<TransactionTable transactions={transactions} />}
		</div>
  )
}

export default TransactionHistory