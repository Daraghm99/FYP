import React from 'react'
import RemoveButton from './RemoveButton'

const UserRow = ({ user, handleRemoveClick }) => {
  return (
    <tr>
        <td id='email'>{user.Record.ID}</td>
        <td>{user.Record.Name}</td>
        <td>{user.Record.Role}</td>
				<td><RemoveButton user={user} handleRemoveClick={handleRemoveClick} /></td>
		</tr>
    
  )
}

export default UserRow