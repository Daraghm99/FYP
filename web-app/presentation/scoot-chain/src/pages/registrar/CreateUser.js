import React from 'react'
import RegistrarNav from './RegistrarNav'
import Footer from '../../components/Footer';
import UserForm from './UserForm';

const CreateUser = () => {
  return (
    <>
			<RegistrarNav />
      <UserForm />
			<Footer />
    </>
  )
}

export default CreateUser