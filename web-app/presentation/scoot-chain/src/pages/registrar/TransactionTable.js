import React from 'react'
import TransactionItem from './TransactionItem'

const TransactionTable = ({ transactions }) => {
  return (
    <div className='table-container'>
      <h1>E-Scooter Transaction History</h1>
      <table className='scooterTable'>
        <thead>
          <tr>
            <th>TimeStamp</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Owner</th>
            <th>Retailer</th>
            <th>Status</th>
            <th>State</th>
          </tr>
        </thead>
				<tbody>
					{transactions.map(transaction => (
            <TransactionItem key={transaction.Key} transaction={transaction} />
        	))}
				</tbody>
      </table>
    </div>
  )
}

export default TransactionTable