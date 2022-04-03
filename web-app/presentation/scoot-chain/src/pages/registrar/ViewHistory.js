import React from 'react'
import RegistrarNav from './RegistrarNav';
import Footer from '../../components/Footer';
import TransactionHistory from './TransactionHistory';
import LHeader from '../../components/LHeader';

const ViewHistory = () => {
  return (
    <>
      <LHeader />
			<RegistrarNav />
      <TransactionHistory />
			<Footer />
    </>
  )
}

export default ViewHistory