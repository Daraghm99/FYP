import React from 'react';
import { Link } from 'react-router-dom';
import Logout from '../../components/Logout';
import LawSearch from './LawSearch';

const LawNav = () => {
  return (
    <div className='Nav'>
      <div className='left'>
        <ul>
            <li><Link to='/viewStolen'>View Stolen E-Scooters</Link></li>
            <LawSearch />
        </ul>
      </div>
      <div className='right'>
        <Logout />
      </div>
    </div>
  )
}

export default LawNav