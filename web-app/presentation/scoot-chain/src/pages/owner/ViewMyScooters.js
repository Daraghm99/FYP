import React from 'react'
import Footer from '../../components/Footer';
import OwnerNav from './OwnerNav';
import OwnerSearch from './OwnerSearch';
import TableList from './TableList';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { confirm } from 'react-confirm-box';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewMyScooters = () => {

  const [scooters, setScooters] = useState([]);

  useEffect(() => {
    const fetchScooters = async () => {
      
      const token  = JSON.parse(localStorage.getItem('authToken'));

      try {
        const response = await axios.get('/scooter/GetMyAssets', {
          headers: {
            'authToken': token
          }
        });
        setScooters(response.data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchScooters();
  }, [])

  /* Function Passed to the transfer button as a prop */
  const handleTransferClick = (serialNumber) => async (e) => {
    e.preventDefault();

    const token  = JSON.parse(localStorage.getItem('authToken'));
    const result = await confirm('Are You sure you Wish to Transfer Ownership of this Asset?'); 

    if(result){
      const newOwner = prompt('Enter New Owner');
      if(newOwner !== null){
        try {
          const response = await axios.put('/scooter/TransferAsset', JSON.stringify({ serialNumber, newOwner }),
          {
            headers: 
            { 	
              'Content-Type': 'application/json',
              'authToken': token
            }
          });
          const scooterList = scooters.filter((scooter) => scooter.Record.SerialNumber !== serialNumber);
          setScooters(scooterList);
          toast.success('E-Scooter Transferred');
          console.log(response);
        } catch (err) {
          if(err.response.status === 413){
            toast.error('User Not Found');
          }
        }
      }
    }
  }

  return (
    <>
      <OwnerNav />
      <ToastContainer />
      <OwnerSearch />
      <TableList scooters={scooters} handleTransferClick={handleTransferClick}/>
      <Footer />
    </>
  )
}

export default ViewMyScooters