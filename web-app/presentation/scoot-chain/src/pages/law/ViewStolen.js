import React from 'react'
import Footer from '../../components/Footer'
import LawNav from './LawNav'
import StolenTable from './StolenTable'
import LawSearch from './LawSearch'
import { useState, useEffect } from 'react';
import axios from '../../api/axios';

const ViewStolen = () => {

	const [stolenScooters, setStolenScooters] = useState([]);

	useEffect(() => {

    const fetchStolen = async () => {

      try {
        const token  = JSON.parse(localStorage.getItem('authToken'));
        const response = await axios.get('/scooter/GetStolenAssets', 
        {
          headers: {
            'authToken': token
          }
        });
        setStolenScooters(response.data);
      } catch(err) {
				console.log(err);
      }
    }
    fetchStolen();
  }, []);

  return (
    <>
			<LawNav />
      <LawSearch />
			<StolenTable stolenScooters={stolenScooters} />
			<Footer />
    </>
  )
}

export default ViewStolen