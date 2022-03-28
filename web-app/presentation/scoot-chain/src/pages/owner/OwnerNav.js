import React from 'react'
import { Link } from 'react-router-dom';

const OwnerNav = () => {
  return (
    <div className='owner-nav'>
        <ul>
            <li><Link to='/createRequest'>CreateRequest</Link></li>
            <li><Link to='/viewScooters'>View My Scooters</Link></li>
            <li><Link to='/viewScooterHistory'>View Scooter History</Link></li>
        </ul>
    </div>
  )
}

export default OwnerNav