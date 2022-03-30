import React from 'react'
import { FaTrash } from 'react-icons/fa'

const RemoveButton = ({ user, handleRemoveClick }) => {

  return (
    <button
      className='stolenButton'
      onClick={handleRemoveClick(user.Record.ID)}
    >
      Remove <FaTrash />
    </button>
  )
}

export default RemoveButton