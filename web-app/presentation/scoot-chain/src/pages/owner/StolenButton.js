import React from 'react'

const StolenButton = ({ scooter }) => {
  return (
    <button
        id='stolen-button'
        onClick={() => console.log(scooter.Record.SerialNumber)}
    >
        Mark As Stolen
    </button>
  )
}

export default StolenButton