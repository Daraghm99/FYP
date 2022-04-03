import React from 'react'
import { Link } from 'react-router-dom';
import Logout from '../../components/Logout';

const RetailerNav = () => {
    return (
        <div className='Nav'>
            <div className='left'>
                <ul>
                    <li><Link to='/registerScooter'>Register E-Scooter</Link></li>
                    <li><Link to='/viewRequests'>View Pending Requests</Link></li>
                </ul>
            </div>
            <div className='right'><Logout /></div>
        </div>
      )
}

export default RetailerNav