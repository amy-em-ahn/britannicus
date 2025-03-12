import React from 'react';
import { Helmet } from 'react-helmet-async';
import Products from './Products';

export default function AllProducts() {
  return (
    <>
      <Helmet>
        <title>All Products | Britannicus BMS</title>
      </Helmet>
      <Products />
    </>
  );
}
