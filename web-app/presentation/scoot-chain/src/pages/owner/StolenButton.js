import React from 'react'
import axios from '../../api/axios';
import { confirm } from 'react-confirm-box';

const StolenButton = ({ scooter }) => {

  const handleStolenClick = (serialNumber) => async (event) => {
    event.preventDefault();

    const token  = JSON.parse(localStorage.getItem('authToken'));

    // Ask The user if they are sure they wish to proceed
    const result = await confirm('Are You sure you Wish to Mark this Asset as Stolen');
    if(result){
      try {
        const response = await axios.put('/scooter/MarkAsStolen', JSON.stringify({ serialNumber }),
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

  return (
    <button
        className='stolenButton'
        onClick={handleStolenClick(scooter.Record.SerialNumber)}
    >
        Mark As Stolen
    </button>
  )
}

export default StolenButton