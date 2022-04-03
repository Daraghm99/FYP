import React from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {

	const navigate = useNavigate();

	const handleLogOutClick = async (e) => {
		e.preventDefault();

		localStorage.removeItem('authToken');

		navigate('/');
	}

  return (
		<div className='logout-container'>
			<button 
				id='logoutButton'
				type='submit'
				onClick={handleLogOutClick}
			>
				Log Out
			</button>
		</div>
  )
}

export default Logout