import React from 'react';
import { FaCheck } from 'react-icons/fa';

const ApproveButton = ({ request, handleApproveClick }) => {

  return (
    <button 
    className='approveButton'
    onClick={handleApproveClick(request.SerialNumber)}
    >
        Approve <FaCheck />
    </button>
  )
}

export default ApproveButton