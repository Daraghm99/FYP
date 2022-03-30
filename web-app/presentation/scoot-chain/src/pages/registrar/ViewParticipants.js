import React from 'react'
import axios from '../../api/axios'
import Footer from '../../components/Footer'
import RegistrarNav from './RegistrarNav'
import UserTable from './UserTable'
import { useState, useEffect } from 'react';
import { confirm } from 'react-confirm-box';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewParticipants = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      
      const token  = JSON.parse(localStorage.getItem('authToken'));

      try {
        const response = await axios.get('/user/GetAllUsers', {
          headers: 
          {
            'authToken': token
          }
        });
        console.log(response.data);
        setUsers(response.data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchUsers();
  }, [])

  const handleRemoveClick = (ID) => async (event) => {
		event.preventDefault();

    const token  = JSON.parse(localStorage.getItem('authToken'));

    // Ask The user if they are sure they wish to proceed
    const result = await confirm('Are You sure you Wish to Remove this Participant from the Network?');
    if(result){
			console.log(ID);
      try {
        await axios.put('/user/RemoveParticipant', JSON.stringify({ ID }),
        {
          headers: 
					{ 	
						'Content-Type': 'application/json',
            'authToken': token
          }
        });
        const listUsers = users.filter((user) => user.Record.ID !== ID);
        setUsers(listUsers);
        toast.success('Participant Removed from the Network');
			this.forceUpdate();
      } catch (err) {
        console.log(err);
      }
    }
	}

  return (
    <>
			<RegistrarNav />
      <ToastContainer />
      <UserTable users={users} handleRemoveClick={handleRemoveClick} />
			<Footer />
    </>
  )
}

export default ViewParticipants