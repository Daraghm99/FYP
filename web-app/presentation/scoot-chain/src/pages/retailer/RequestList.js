import React from 'react'
import RequestItem from './RequestItem'

const RequestList = ({ requests, handleApproveClick, handleRejectClick }) => {
  return (
    <div className='table-container'>
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
            <RequestItem key={request.SerialNumber} request={request} handleApproveClick={handleApproveClick} handleRejectClick={handleRejectClick} />
        	))}
				</tbody>
      </table>
    </div>
  )
}

export default RequestList