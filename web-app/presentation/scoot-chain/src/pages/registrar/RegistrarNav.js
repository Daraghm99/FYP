import React from 'react'
import { Link } from 'react-router-dom'
import Logout from '../../components/Logout'

const RegistrarNav = () => {
  return (
    <div className='Nav'>
      <div className='left'>
        <ul>
            <li><Link to='/createUser'>Create User</Link></li>
            <li><Link to='/viewParticipants'>View All Participants</Link></li>
            <li><Link to='/viewHistory'>View Transaction History</Link></li>
        </ul>
      </div>
      <div className='right'>
        <Logout />
      </div>
    </div>
  )
}

export default RegistrarNav