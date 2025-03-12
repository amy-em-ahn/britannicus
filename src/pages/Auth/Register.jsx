import React from 'react';
import { Helmet } from 'react-helmet-async';
import RegisterForm from '../../components/RegisterForm';
function passTo() {
  console.log("function ran")
}
export default function Register({darkMode}) {
  return (
    <div>
      <Helmet>
        <title>Register | Britannicus BMS</title>
      </Helmet>
      <RegisterForm handleFunction={passTo} darkMode={darkMode}/>
    </div>
  );
}
