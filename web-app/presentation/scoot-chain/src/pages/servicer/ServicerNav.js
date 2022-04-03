import React from 'react'
import { Link } from 'react-router-dom';
import Logout from '../../components/Logout';

const ServicerNav = () => {
  return (
    <div className='Nav'>
      <div className='left'>
        <ul>
            <li><Link to='/createService'>Create E-Scooter Service</Link></li>
        </ul>
      </div>
      <div className='right'>
        <Logout />
      </div>
    </div>
  )
}

export default ServicerNav