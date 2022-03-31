import React from 'react';
import RetailerNav from './RetailerNav';
import Footer from '../../components/Footer';
import RequestList from './RequestList';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { confirm } from 'react-confirm-box';
import { toast } from 'react-toastify';

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

  /* Function to handle when the approve button is clicked */
  const handleApproveClick = (serialNumber) => async (e) => {
		e.preventDefault();

		const token  = JSON.parse(localStorage.getItem('authToken'));

		const result = await confirm('Are you sure you wish to Approve this Request?');
    if(result){
			try {
				await axios.put('/scooter/ApproveRequest', JSON.stringify({ serialNumber }),
				{
          headers: 
          { 	
            'Content-Type': 'application/json',
            'authToken': token
          }
        });
        const requestList = requests.filter((request) => request.Record.SerialNumber !== serialNumber);
        setRequests(requestList);
				toast.success('E-Scooter Request Approved');
			}catch(err) {
        console.log(err);
			}
		}
	}

  /* Function to handle reject button click, passed as prop */
  const handleRejectClick = (serialNumber) => async (e) => {
		e.preventDefault();

		const token = JSON.parse(localStorage.getItem('authToken'));

		const result = await confirm('Are you sure you wish to Reject this Request?');
    if(result){
			try {
				await axios.put('/scooter/RejectRequest', JSON.stringify({ serialNumber }),
				{
          headers: { 
            'Content-Type': 'application/json',
            'authToken': token 
          }
        });
        const requestList = requests.filter((request) => request.Record.SerialNumber !== serialNumber);
        setRequests(requestList);
        toast.success('E-Scooter Request Rejected');   
			}catch(err) {
        console.log(err);
			}
		}
	}


  return (
    <>
    	<RetailerNav />
      <RequestList requests={requests} handleApproveClick={handleApproveClick} handleRejectClick={handleRejectClick}/>
    	<Footer />
		</>	
  )
}

export default ViewRequests