import React from 'react'

const StolenItem = ({ stolenScooter }) => {
  return (
  	<tr>
      	<td id='serial-number'>{stolenScooter.Record.SerialNumber}</td>
        <td>{stolenScooter.Record.Manufacturer}</td>
        <td>{stolenScooter.Record.Model}</td>
        <td>{stolenScooter.Record.Owner}</td>
        <td>{stolenScooter.Record.Status}</td>
    </tr>
  )
}

export default StolenItem