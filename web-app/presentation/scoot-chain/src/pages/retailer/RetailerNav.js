import React from 'react'
import { Link } from 'react-router-dom';

const RetailerNav = () => {
    return (
        <div className='Nav'>
            <ul>
                <li><Link to='/registerScooter'>Register E-Scooter</Link></li>
                <li><Link to='/viewRequests'>View Pending Requests</Link></li>
            </ul>
        </div>
      )
}

export default RetailerNav