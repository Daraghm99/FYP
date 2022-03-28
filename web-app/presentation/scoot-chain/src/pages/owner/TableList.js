import React from 'react'
import TableItem from './TableItem';

const ItemList = ({ scooters }) => {
  return (
    <div className='table-container'>
      <table>
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