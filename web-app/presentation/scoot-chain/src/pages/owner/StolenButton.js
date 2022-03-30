import React from 'react'

const StolenButton = ({ scooter, handleStolenClick }) => {

  return (
    <button
      className='stolenButton'
      onClick={handleStolenClick(scooter.Record.SerialNumber)}
    >
      Mark As Stolen
    </button>
  )
}

export default StolenButton