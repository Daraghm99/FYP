import React from 'react'

const TransferButton = ({ scooter, handleTransferClick }) => {

  return (
    <button
        className='transferButton'
        onClick={handleTransferClick(scooter.SerialNumber)}
    >
        Transfer Ownership
    </button>
  )
}

export default TransferButton