import React from 'react'
import RegistrarNav from './RegistrarNav';
import Footer from '../../components/Footer';
import TransactionHistory from './TransactionHistory';

const ViewHistory = () => {
  return (
    <>
			<RegistrarNav />
      <TransactionHistory />
			<Footer />
    </>
  )
}

export default ViewHistory