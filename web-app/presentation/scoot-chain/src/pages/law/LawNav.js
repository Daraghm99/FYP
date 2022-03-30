import React from 'react';
import { Link } from 'react-router-dom';

const LawNav = () => {
  return (
    <div className='Nav'>
        <ul>
            <li><Link to='/viewStolen'>View Stolen E-Scooters</Link></li>
        </ul>
    </div>
  )
}

export default LawNav