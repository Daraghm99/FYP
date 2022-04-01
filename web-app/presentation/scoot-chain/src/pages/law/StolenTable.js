import React from 'react'
import StolenItem from './StolenItem'

const StolenTable = ({ stolenScooters }) => {
  return (
    <div className='table-container'>
      <h1>All E-Scooters Marked as Stolen on the Network</h1>
      <p>Review these Stolen Assets</p>
      <table className='requestTable'>
        <thead>
          <tr>
            <th>Serial Number</th>
						<th>Manufacturer</th>
						<th>Model</th>
						<th>Owner</th>
						<th>Status</th>
          </tr>
        </thead>
				<tbody>
					{stolenScooters.map(stolenScooter => (
            <StolenItem key={stolenScooter.SerialNumber} stolenScooter={stolenScooter} />
        	))}
				</tbody>
      </table>
    </div>
  )
}

export default StolenTable