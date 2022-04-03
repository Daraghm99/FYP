import React from 'react';
import OwnerNav from './OwnerNav';
import Footer from '../../components/Footer';
import ServiceHistory from './ServiceHistory';
import LHeader from '../../components/LHeader';

const ViewScooterHistory = () => {
  return (
    <>
      <LHeader />
      <OwnerNav />
      <ServiceHistory />
      <Footer />
    </>
  )
}

export default ViewScooterHistory