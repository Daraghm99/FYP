import React from 'react';
import RetailerNav from './RetailerNav';
import Footer from '../../components/Footer';
import RequestList from './RequestList';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';

const ViewRequests = () => {

  const [requests, setRequests] = useState([]);

  useEffect(() => {

    const fetchRequests = async () => {

      try {
        const token  = JSON.parse(localStorage.getItem('authToken'));
        const response = await axios.get('/scooter/GetMyRequests', 
        {
          headers: {
            'authToken': token
          }
        });
        setRequests(response.data);
      } catch(err) {

      }
    }
    fetchRequests();
  }, []);

  return (
    <>
    	<RetailerNav />
      <RequestList requests={requests} />
    	<Footer />
		</>	
  )
}

export default ViewRequests