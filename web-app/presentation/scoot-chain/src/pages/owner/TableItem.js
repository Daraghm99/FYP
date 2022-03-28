import React from 'react'
import TransferButton from './TransferButton';
import StolenButton from './StolenButton';


const Item = ({ scooter }) => {

  return (
    <tr>
        <td id='serial-number'>{scooter.Record.SerialNumber}</td>
        <td>{scooter.Record.Manufacturer}</td>
        <td>{scooter.Record.Model}</td>
        <td>{scooter.Record.Retailer}</td>
        <td>{scooter.Record.Status}</td>
        <td>{scooter.Record.State}</td>
        <td><TransferButton scooter={scooter} /></td>
        <td><StolenButton scooter={scooter} /></td>
    </tr>
  )
}

export default Item