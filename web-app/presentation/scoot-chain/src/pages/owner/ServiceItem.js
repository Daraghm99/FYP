import React from 'react'

const ServiceItem = ({ service }) => {
  return (
    <tr>
        <td>{service.ServiceDate}</td>
        <td>{service.ServiceType}</td>
        <td>{service.ServiceDescription}</td>
    </tr>
  )
}

export default ServiceItem