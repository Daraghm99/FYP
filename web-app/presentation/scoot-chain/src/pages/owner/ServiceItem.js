import React from 'react'

const ServiceItem = ({ service }) => {
  return (
    <tr>
        <td id='serial-number'>{service.SerialNumber}</td>
        <td>{service.ServiceType}</td>
        <td>{service.ServiceDescription}</td>
    </tr>
  )
}

export default ServiceItem