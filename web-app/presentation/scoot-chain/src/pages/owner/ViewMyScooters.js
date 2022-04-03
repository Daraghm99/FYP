import React from 'react'
import Footer from '../../components/Footer';
import OwnerNav from './OwnerNav';
import TableList from './TableList';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { confirm } from 'react-confirm-box';
import { toast } from 'react-toastify';
import FilterScooters from './FilterScooters';

const ViewMyScooters = () => {

  const [scooters, setScooters] = useState([]);
  const [filter, setFilter] = useState('');

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
          console.log('here');
          const scooterList = scooters.filter((scooter) => scooter.SerialNumber !== serialNumber);
          setScooters(scooterList);
          toast.success('E-Scooter Transferred');
          console.log(response);
        } catch (err) {
          if(err.response?.status === 405){
            toast.error('User Not Found');
          } else if (err.response?.status){
            toast.error('Transfer Forbidden');
          }
        }
      }
    }
  }

  /* Function Passed to Stolen Button as Prop */
  const handleStolenClick = (serialNumber) => async (event) => {
    event.preventDefault();

    const token  = JSON.parse(localStorage.getItem('authToken'));

    // Ask The user if they are sure they wish to proceed
    const result = await confirm('Are You sure you Wish to Mark this Asset as Stolen');
    if(result){
      try {
        await axios.put('/scooter/MarkAsStolen', JSON.stringify({ serialNumber }),
        {
          headers: 
          { 	
            'Content-Type': 'application/json',
            'authToken': token
          }
        });
        toast.success('E-Scooter Marked as Stolen');
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <>
      <OwnerNav />
      <FilterScooters filter={filter} setFilter={setFilter} />
      <TableList scooters={scooters.filter(scooter => ((scooter.SerialNumber).toLowerCase()).includes(filter.toLowerCase()))} handleTransferClick={handleTransferClick} handleStolenClick={handleStolenClick}/>
      <Footer />
    </>
  )
}

export default ViewMyScooters