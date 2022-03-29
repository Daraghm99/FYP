import React from 'react'
import ApproveButton from './ApproveButton'
import StolenButton from '../owner/StolenButton'

const RequestItem = ({ request }) => {
  return (
    <tr>
      	<td id='serial-number'>{request.Record.SerialNumber}</td>
        <td>{request.Record.Manufacturer}</td>
        <td>{request.Record.Model}</td>
        <td>{request.Record.Owner}</td>
        <td>{request.Record.Status}</td>
        <td><ApproveButton request={request} /></td>
        <td><StolenButton request={request} /></td>
    </tr>
  )
}

export default RequestItem