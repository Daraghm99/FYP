import React from 'react'
import Footer from '../../components/Footer';
import OwnerNav from './OwnerNav';
import RequestForm from './RequestForm';
import LHeader from '../../components/LHeader';

const CreateRequest = () => {
  return (
  <>
    <LHeader />
    <OwnerNav />
    <RequestForm />
    <Footer />
  </>
  )
}

export default CreateRequest