import React from 'react'
import TransferButton from './TransferButton';
import StolenButton from './StolenButton';


const Item = ({ scooter, handleTransferClick, handleStolenClick }) => {

  return (
    <tr>
        <td id='serial-number'>{scooter.SerialNumber}</td>
        <td>{scooter.Manufacturer}</td>
        <td>{scooter.Model}</td>
        <td>{scooter.Retailer}</td>
        <td>{scooter.Status}</td>
        <td>{scooter.State}</td>
        <td><TransferButton scooter={scooter} handleTransferClick={handleTransferClick}/></td>
        <td><StolenButton scooter={scooter} handleStolenClick={handleStolenClick} /></td>
    </tr>
  )
}

export default Item