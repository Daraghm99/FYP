import React from 'react'
import RemoveButton from './RemoveButton'

const UserRow = ({ user, handleRemoveClick }) => {
  return (
    <tr>
        <td id='email'>{user.ID}</td>
        <td>{user.Name}</td>
        <td>{user.Role}</td>
				<td><RemoveButton user={user} handleRemoveClick={handleRemoveClick} /></td>
		</tr>
    
  )
}

export default UserRow