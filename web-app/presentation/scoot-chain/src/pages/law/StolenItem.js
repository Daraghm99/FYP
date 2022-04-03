import React from 'react'

const StolenItem = ({ stolenScooter }) => {
  return (
  	<tr>
      	<td id='serial-number'>{stolenScooter.SerialNumber}</td>
        <td>{stolenScooter.Manufacturer}</td>
        <td>{stolenScooter.Model}</td>
        <td>{stolenScooter.Owner}</td>
        <td>{stolenScooter.Retailer}</td>
        <td>{stolenScooter.Status}</td>
    </tr>
  )
}

export default StolenItem