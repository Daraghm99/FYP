import React from 'react'
import TableItem from './TableItem';

const ItemList = ({ scooters }) => {
  return (
    <div className='table-container'>
      <h1>Your E-scooters</h1>
      <p>Click the button below to tranfer ownership of your E-scooter</p>
      <p>Has your E-Scooter been stolen? Click the button below to mark it as stolen.</p>
      <table className='scooterTable'>
        <thead>
          <tr>
            <th>Serial Number</th>
						<th>Manufacturer</th>
						<th>Model</th>
						<th>Retailer</th>
						<th>Status</th>
						<th>State</th>
            <th>Transfer Ownership</th>
            <th>Mark As Stolen</th>
          </tr>
        </thead>
				<tbody>
					{scooters.map(scooter => (
            <TableItem key={scooter.Key} scooter={scooter} />
        	))}
				</tbody>
      </table>
    </div>
  )
}

export default ItemList