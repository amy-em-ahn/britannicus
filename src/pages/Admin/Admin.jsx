import React from 'react';
import { Helmet } from 'react-helmet-async';
import ProductForm from '../../components/ProductForm';

export default function Admin() {
  return (
    <>
      <Helmet>
        <title>Admin | Britannicus BMS</title>
      </Helmet>
      <section className='w-full text-center'>
        <h1 className='text-2xl font-bold mt-4'>Add New Product</h1>
        <ProductForm />
      </section>
    </>
  );
}
