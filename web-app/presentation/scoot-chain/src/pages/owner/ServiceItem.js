import React from 'react'

const ServiceItem = ({ service }) => {
  return (
    <tr>
        <td id='serial-number'>{service.Record.SerialNumber}</td>
        <td>{service.Record.ServiceDescription}</td>
    </tr>
  )
}

export default ServiceItem