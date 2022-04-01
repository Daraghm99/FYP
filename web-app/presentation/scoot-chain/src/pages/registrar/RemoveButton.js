import React from 'react'
import { FaTrash } from 'react-icons/fa'

const RemoveButton = ({ user, handleRemoveClick }) => {

  return (
    <button
      className='stolenButton'
      onClick={handleRemoveClick(user.ID)}
    >
      Remove <FaTrash />
    </button>
  )
}

export default RemoveButton