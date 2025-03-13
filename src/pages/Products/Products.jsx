import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/supabase';
import ProductCard from '../../components/ProductCard';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Products() {
  const location = useLocation();
  const currentPath = location.pathname;

  let category = '';
  let title = 'All Products';

  if (currentPath.includes('rare-books')) {
    category = 'rare-books';
    title = 'Rare Books';
  } else if (currentPath.includes('maps')) {
    category = 'maps';
    title = 'Vintage Maps';
  } else if (currentPath.includes('periodicals')) {
    category = 'periodicals';
    title = 'Periodicals';
  } else if (currentPath.includes('first-editions')) {
    category = 'first-editions';
    title = 'First Editions';
  }

  const {
    isLoading,
    error,
    data: products
  } = useQuery([`products-${category || 'all'}`], () => getProducts(category));

  return (
    <>
      <Helmet>
        <title>{title} | Britannicus BMS</title>
      </Helmet>

      <section className='w-full max-w-[1200px] mx-auto'>
        <h1 className='mt-4 mb-6 text-2xl font-bold text-center'>{title}</h1>

        {isLoading && <p className='text-center'>Loading...</p>}
        {error && (
          <p className='text-center text-red-500'>Error: {error.message}</p>
        )}

        <ul className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {products &&
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </ul>
      </section>
    </>
  );
}
