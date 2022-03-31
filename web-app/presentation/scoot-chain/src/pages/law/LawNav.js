import React from 'react';
import { Link } from 'react-router-dom';
import Logout from '../../components/Logout';

const LawNav = () => {
  return (
    <div className='Nav'>
        <ul>
            <li><Link to='/viewStolen'>View Stolen E-Scooters</Link></li>
            <Logout />
        </ul>
    </div>
  )
}

export default LawNav