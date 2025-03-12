import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';

export default function Admin() {
  const { productType } = useParams();

  let title = 'Add New Book';
  let formType = 'general';

  if (productType === 'books') {
    title = 'Add New Book';
    formType = 'book';
  } else if (productType === 'maps') {
    title = 'Add New Map';
    formType = 'map';
  }

  return (
    <>
      <Helmet>
        <title>Admin | Britannicus BMS</title>
      </Helmet>
      <section className='w-full text-center'>
        <h1 className='text-2xl font-bold mt-4'>{title}</h1>
        <ProductForm type={formType} />
      </section>
    </>
  );
}
