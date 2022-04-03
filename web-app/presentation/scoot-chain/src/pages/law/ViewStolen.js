import React from 'react'
import Footer from '../../components/Footer'
import LawNav from './LawNav'
import StolenTable from './StolenTable'
import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import FilterStolen from './FilterStolen'
import LHeader from '../../components/LHeader';

const ViewStolen = () => {

	const [stolenScooters, setStolenScooters] = useState([]);
  const [filter, setFilter] = useState('');

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
      <LHeader />
			<LawNav />
      <FilterStolen filter={filter} setFilter={setFilter} />
			<StolenTable stolenScooters={stolenScooters.filter(stolenScooter => ((stolenScooter.SerialNumber).toLowerCase()).includes(filter.toLowerCase()))} />
			<Footer />
    </>
  )
}

export default ViewStolen