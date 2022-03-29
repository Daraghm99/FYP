import React from 'react'
import axios from '../../api/axios';
import { confirm } from 'react-confirm-box';

const TransferButton = ({ scooter }) => {

  const handleTransferClick = (serialNumber) => async (e) => {
    e.preventDefault();
    const token  = JSON.parse(localStorage.getItem('authToken'));
		
    const result = await confirm('Are You sure you Wish to Transfer Ownership of this Asset?'); 

    if(result){
      const newOwner = prompt('Enter New Owner');

      if(newOwner !== null){

        try {
          const response = await axios.put('/scooter/TransferAsset', JSON.stringify({ serialNumber, newOwner }),
          {
            headers: { 	'Content-Type': 'application/json',
                        'authToken': token
            }
          });
          console.log(response);
        } catch (err) {
          console.log(err);
        }

      }
    }
  }

  return (
    <button
        className='transferButton'
        onClick={handleTransferClick(scooter.Record.SerialNumber)}
    >
        Transfer Ownership
    </button>
  )
}

export default TransferButton