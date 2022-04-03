import React from 'react';
import RetailerNav from './RetailerNav';
import Footer from '../../components/Footer';
import RegisterForm from './RegisterForm';
import LHeader from '../../components/LHeader';

const RegisterScooter = () => {
  return (
    <>
      <LHeader />
			<RetailerNav />
			<RegisterForm />
			<Footer />
    </>
  )
}

export default RegisterScooter