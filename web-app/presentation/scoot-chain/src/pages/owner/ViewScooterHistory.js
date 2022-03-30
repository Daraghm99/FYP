import React from 'react';
import OwnerNav from './OwnerNav';
import OwnerSearch from './OwnerSearch';
import Footer from '../../components/Footer';
import ServiceHistory from './ServiceHistory';

const ViewScooterHistory = () => {
  return (
    <>
      <OwnerNav />
      <OwnerSearch />
      <ServiceHistory />
      <Footer />
    </>
  )
}

export default ViewScooterHistory