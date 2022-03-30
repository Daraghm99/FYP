import React from 'react'
import { FaTrash } from 'react-icons/fa';
import axios from '../../api/axios';
import { confirm } from 'react-confirm-box';

const RejectButton = ({ request }) => {

  const handleRejectClick = (serialNumber) => async (e) => {
		e.preventDefault();

		const token = JSON.parse(localStorage.getItem('authToken'));

		const result = await confirm('Are you sure you wish to Reject this Request?');
    if(result){
			try {
				const response = await axios.put('/scooter/RejectRequest', JSON.stringify({ serialNumber }),
				{
          headers: { 
            'Content-Type': 'application/json',
            'authToken': token 
          }
        });
        console.log(response);
				alert('E-Scooter Request Rejected');
			}catch(err) {
        console.log(err);
			}
		}

	}

  return (
    <button 
    className='rejectButton'
    onClick={handleRejectClick(request.Record.SerialNumber)}
    >
        Reject <FaTrash />
    </button>
  )
}

export default RejectButton