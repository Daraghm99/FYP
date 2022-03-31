import React from 'react'
import { Link } from 'react-router-dom';
import Logout from '../../components/Logout';

const RetailerNav = () => {
    return (
        <div className='Nav'>
            <ul>
                <li><Link to='/registerScooter'>Register E-Scooter</Link></li>
                <li><Link to='/viewRequests'>View Pending Requests</Link></li>
                <Logout />
            </ul>
        </div>
      )
}

export default RetailerNav