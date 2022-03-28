import React from 'react'

const handleTransfer = async (e) => {
  e.preventDefault();


}

const TransferButton = ({ scooter }) => {
  return (
    <button
        id='transfer-button'
        onClick={() => console.log(scooter.Record.SerialNumber)}
    >
        Transfer Ownership
    </button>
  )
}

export default TransferButton