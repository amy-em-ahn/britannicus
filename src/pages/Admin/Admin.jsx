import React from 'react';
import './Admin.style.css';
import { Helmet } from 'react-helmet-async';

export default function Admin() {
  return (
    <>
      <Helmet>
        <title>Admin | Britannicus BMS</title>
      </Helmet>
      <div>Admin</div>
    </>
  );
}
