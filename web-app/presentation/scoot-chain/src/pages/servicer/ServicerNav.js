import React from 'react'
import { Link } from 'react-router-dom';

const ServicerNav = () => {
  return (
    <div className='Nav'>
        <ul>
            <li><Link to='/createService'>Create E-Scooter Service</Link></li>
        </ul>
    </div>
  )
}

export default ServicerNav