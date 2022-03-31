import React from 'react'
import { Link } from 'react-router-dom'
import Logout from '../../components/Logout'

const RegistrarNav = () => {
  return (
    <div className='Nav'>
        <ul>
            <li><Link to='/createUser'>Create User</Link></li>
            <li><Link to='/viewParticipants'>View Participants</Link></li>
            <li><Link to='/viewHistory'>View Transaction History</Link></li>
            <Logout />
        </ul>
    </div>
  )
}

export default RegistrarNav