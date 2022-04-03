import React from 'react'
import UserRow from './UserRow'

const UserTable = ({ users, handleRemoveClick }) => {
  return (
    <div className='table-container'>
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
            <UserRow key={user.ID} user={user} handleRemoveClick={handleRemoveClick} />
        	))}
				</tbody>
      </table>
    </div>
  )
}

export default UserTable