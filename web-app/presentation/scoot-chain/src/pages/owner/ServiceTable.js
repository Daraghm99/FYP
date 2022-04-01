import React from 'react'
import ServiceItem from './ServiceItem'

const ServiceTable = ({ services }) => {
  return (
    <div className='table-container'>
      <h1>E-Scooter Service History</h1>
      <table className='scooterTable'>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Service Type</th>
            <th>Service Description</th>
          </tr>
        </thead>
				<tbody>
					{services.map(service => (
            <ServiceItem key={service.Key} service={service} />
        	))}
				</tbody>
      </table>
    </div>
  )
}

export default ServiceTable