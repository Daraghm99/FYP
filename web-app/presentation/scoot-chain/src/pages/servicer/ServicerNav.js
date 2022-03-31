import React from 'react'
import { Link } from 'react-router-dom';
import Logout from '../../components/Logout';

const ServicerNav = () => {
  return (
    <div className='Nav'>
        <ul>
            <li><Link to='/createService'>Create E-Scooter Service</Link></li>
            <Logout />
        </ul>
    </div>
  )
}

export default ServicerNav