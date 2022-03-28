import React from 'react'
import Footer from '../../components/Footer';
import OwnerNav from './OwnerNav';
import TableList from './TableList';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';

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
        console.log(response.data.Object);
      } catch(err) {
        console.log(err);
      }
    }
    fetchScooters();
  }, [])

  return (
    <>
      <OwnerNav />
      <TableList scooters={scooters}/>
      <Footer />
    </>
  )
}

export default ViewMyScooters