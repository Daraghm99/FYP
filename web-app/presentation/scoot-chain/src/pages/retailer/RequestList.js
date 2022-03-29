import React from 'react'
import RequestItem from './RequestItem'

const RequestList = ({ requests }) => {
  return (
    <div className='table-container'>
      <h1>Pending E-Scooter Registration Requests</h1>
      <p>Click the Buttons below to either Approve or Reject a Request</p>
      <table className='requestTable'>
        <thead>
          <tr>
            <th>Serial Number</th>
						<th>Manufacturer</th>
						<th>Model</th>
						<th>Owner</th>
						<th>Status</th>
            <th>Approve Request</th>
            <th>Reject Request</th>
          </tr>
        </thead>
				<tbody>
					{requests.map(request => (
            <RequestItem key={request.Key} request={request} />
        	))}
				</tbody>
      </table>
    </div>
  )
}

export default RequestList