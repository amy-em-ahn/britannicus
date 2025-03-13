import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/firebase';
import ProductCard from '../../components/ProductCard';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Products() {
  const location = useLocation();
  const currentPath = location.pathname;

  let category = '';
  let title = 'All Products';
  let endpoint = null;

  if (currentPath.includes('rare-books')) {
    category = 'rare-books';
    title = 'Rare Books';
    endpoint = 'products/rare-book';
  } else if (currentPath.includes('maps')) {
    category = 'maps';
    title = 'Vintage Maps';
    endpoint = 'products/maps';
  } else if (currentPath.includes('periodicals')) {
    category = 'periodicals';
    title = 'Periodicals';
    endpoint = 'products/periodicals';
  } else if (currentPath.includes('first-editions')) {
    category = 'first-editions';
    title = 'First Editions';
    endpoint = 'products/first-editions';
  }

  const {
    isLoading,
    error,
    data: products
  } = useQuery([`products-${category || 'all'}`], () => getProducts(endpoint));

  return (
    <>
      <Helmet>
        <title>{title} | Britannicus BMS</title>
      </Helmet>

      <section className='w-full'>
        <h1 className='text-2xl font-bold mt-4 mb-6 text-center'>{title}</h1>

        {isLoading && <p className='text-center'>Loading...</p>}
        {error && (
          <p className='text-center text-red-500'>Error: {error.message}</p>
        )}

        <ul className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
          {products &&
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </ul>
      </section>
    </>
  );
}
