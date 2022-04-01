import React from 'react';
import ApproveButton from './ApproveButton';
import RejectButton from './RejectButton';

const RequestItem = ({ request, handleApproveClick, handleRejectClick }) => {
  return (
    <tr>
      	<td id='serial-number'>{request.SerialNumber}</td>
        <td>{request.Manufacturer}</td>
        <td>{request.Model}</td>
        <td>{request.Owner}</td>
        <td>{request.Status}</td>
        <td><ApproveButton request={request} handleApproveClick={handleApproveClick} /></td>
        <td><RejectButton request={request} handleRejectClick={handleRejectClick} /></td>
    </tr>
  )
}

export default RequestItem