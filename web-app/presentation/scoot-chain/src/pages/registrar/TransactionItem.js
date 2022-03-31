import React from 'react'

const TransactionItem = ({ transaction }) => {
  return (
    <tr>
        <td>{transaction.Timestamp}</td>
        <td>{transaction.Manufacturer}</td>
				<td>{transaction.Model}</td>
				<td>{transaction.Owner}</td>
				<td>{transaction.Retailer}</td>
				<td>{transaction.Status}</td>
				<td>{transaction.State}</td>
    </tr>
  )
}

export default TransactionItem