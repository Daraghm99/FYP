import React from 'react';
import Footer from '../../components/Footer';
import ServicerNav from './ServicerNav';
import ServiceForm from './ServiceForm';
import LHeader from '../../components/LHeader';

const CreateService = () => {
  return (
    <>
      <LHeader />
			<ServicerNav />
			<ServiceForm />
			<Footer />
    </>
  )
}

export default CreateService