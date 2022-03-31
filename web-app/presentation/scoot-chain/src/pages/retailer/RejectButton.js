import React from 'react'
import { FaTrash } from 'react-icons/fa';

const RejectButton = ({ request, handleRejectClick }) => {

  return (
    <button 
    className='rejectButton'
    onClick={handleRejectClick(request.Record.SerialNumber)}
    >
        Reject <FaTrash />
    </button>
  )
}

export default RejectButton