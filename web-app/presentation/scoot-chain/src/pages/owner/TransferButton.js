import React from 'react'

const TransferButton = ({ scooter, handleTransferClick }) => {

  return (
    <button
        className='transferButton'
        onClick={handleTransferClick(scooter.Record.SerialNumber)}
    >
        Transfer Ownership
    </button>
  )
}

export default TransferButton