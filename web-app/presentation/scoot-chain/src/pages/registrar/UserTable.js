import React from 'react'
import UserRow from './UserRow'

const UserTable = ({ users, handleRemoveClick }) => {
  return (
    <div className='table-container'>
      <h1>All Participants on the Network</h1>
      <p>Click the Remove button beside a User to remove them from the Network</p>
      <table className='scooterTable'>
        <thead>
          <tr>
            <th>Email</th>
						<th>Name</th>
						<th>Role</th>
            <th>Remove Participant?</th>
          </tr>
        </thead>
				<tbody>
					{users.map(user => (
            <UserRow key={user.Key} user={user} handleRemoveClick={handleRemoveClick} />
        	))}
				</tbody>
      </table>
    </div>
  )
}

export default UserTable