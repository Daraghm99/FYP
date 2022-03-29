import React from 'react'
import Footer from '../../components/Footer';
import OwnerNav from './OwnerNav';
import RequestForm from './RequestForm';
import OwnerSearch from './OwnerSearch';

const CreateRequest = () => {
  return (
  <>
    <OwnerNav />
    <OwnerSearch />
    <RequestForm />
    <Footer />
  </>
  )
}

export default CreateRequest