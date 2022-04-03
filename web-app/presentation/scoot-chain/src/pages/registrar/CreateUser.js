import React from 'react'
import RegistrarNav from './RegistrarNav'
import Footer from '../../components/Footer';
import UserForm from './UserForm';
import LHeader from '../../components/LHeader';

const CreateUser = () => {
  return (
    <>
      <LHeader />
			<RegistrarNav />
      <UserForm />
			<Footer />
    </>
  )
}

export default CreateUser