import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { confirm } from 'react-confirm-box';
import axios from '../../api/axios';

const ApproveButton = ({ request }) => {

	const handleApproveClick = (serialNumber) => async (e) => {
		e.preventDefault();

		const token  = JSON.parse(localStorage.getItem('authToken'));

		const result = await confirm('Are you sure you wish to Approve this Request?');
    if(result){
			try {
				await axios.put('/scooter/ApproveRequest', JSON.stringify({ serialNumber }),
				{
          headers: { 	'Content-Type': 'application/json',
                      'authToken': token
          }
        });
				alert('E-Scooter Registered');
			}catch(err) {

			}
		}

	}

  return (
    <button 
    className='approveButton'
    onClick={handleApproveClick(request.Record.SerialNumber)}
    >
        Approve <FaCheck />
    </button>
  )
}

export default ApproveButton