import React from 'react';
import ApproveButton from './ApproveButton';
import RejectButton from './RejectButton';

const RequestItem = ({ request, handleApproveClick, handleRejectClick }) => {
  return (
    <tr>
      	<td id='serial-number'>{request.Record.SerialNumber}</td>
        <td>{request.Record.Manufacturer}</td>
        <td>{request.Record.Model}</td>
        <td>{request.Record.Owner}</td>
        <td>{request.Record.Status}</td>
        <td><ApproveButton request={request} handleApproveClick={handleApproveClick} /></td>
        <td><RejectButton request={request} handleRejectClick={handleRejectClick} /></td>
    </tr>
  )
}

export default RequestItem