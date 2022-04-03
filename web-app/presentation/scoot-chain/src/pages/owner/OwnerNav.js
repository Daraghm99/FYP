import React from 'react'
import { Link } from 'react-router-dom';
import Logout from '../../components/Logout';
import OwnerSearch from './OwnerSearch';

const OwnerNav = () => {
  return (
    <div className='Nav'>
      <div className='left'>
        <ul>
            <li><Link to='/createRequest'>Create Request</Link></li>
            <li><Link to='/viewScooters'>View My Scooters</Link></li>
            <li><Link to='/viewScooterHistory'>View Scooter History</Link></li>
            <OwnerSearch />
        </ul>
      </div>
      <div className='right'><Logout /></div>
    </div>
  )
}

export default OwnerNav