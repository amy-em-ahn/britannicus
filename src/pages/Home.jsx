import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/supabase';
import ProductCard from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const CategorySection = ({ products, category, title, endpoint }) => {
  if (!products || products.length === 0) {
    return <p className='text-center'>No products available</p>;
  }

  return (
    <section className='w-full mb-12'>
      <div className='flex items-center justify-between px-4 mb-4'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <Link
          to={`/products/${endpoint}`}
          className='text-blue-600 hover:underline'
        >
          View All
        </Link>
      </div>

      <ul className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </section>
  );
};

export default function Home() {
  const {
    isLoading: loadingRareBooks,
    error: errorRareBooks,
    data: rareBooks
  } = useQuery(['products-rare-books-preview'], () =>
    getProducts('rare-books')
  );

  const {
    isLoading: loadingMaps,
    error: errorMaps,
    data: maps
  } = useQuery(['products-maps-preview'], () => getProducts('maps'));

  const {
    isLoading: loadingPeriodicals,
    error: errorPeriodicals,
    data: periodicals
  } = useQuery(['products-periodicals-preview'], () =>
    getProducts('periodicals')
  );

  const {
    isLoading: loadingFirstEditions,
    error: errorFirstEditions,
    data: firstEditions
  } = useQuery(['products-first-editions-preview'], () =>
    getProducts('first-editions')
  );

  return (
    <>
      <Helmet>
        <title>Home | Britannicus BMS</title>
      </Helmet>

      <div className='w-full max-w-[1200px] mx-auto'>
        {loadingRareBooks && (
          <p className='text-center'>Loading Rare Books...</p>
        )}
        {errorRareBooks && (
          <p className='text-center text-red-500'>
            Error: {errorRareBooks.message}
          </p>
        )}
        {rareBooks && (
          <CategorySection
            products={rareBooks}
            category='rare-books'
            title='Rare Books'
            endpoint='rare-books'
          />
        )}

        {loadingMaps && <p className='text-center'>Loading Vintage Maps...</p>}
        {errorMaps && (
          <p className='text-center text-red-500'>Error: {errorMaps.message}</p>
        )}
        {maps && (
          <CategorySection
            products={maps}
            category='maps'
            title='Vintage Maps'
            endpoint='maps'
          />
        )}

        {loadingPeriodicals && (
          <p className='text-center'>Loading Periodicals...</p>
        )}
        {errorPeriodicals && (
          <p className='text-center text-red-500'>
            Error: {errorPeriodicals.message}
          </p>
        )}
        {periodicals && (
          <CategorySection
            products={periodicals}
            category='periodicals'
            title='Periodicals'
            endpoint='periodicals'
          />
        )}

        {loadingFirstEditions && (
          <p className='text-center'>Loading First Editions...</p>
        )}
        {errorFirstEditions && (
          <p className='text-center text-red-500'>
            Error: {errorFirstEditions.message}
          </p>
        )}
        {firstEditions && (
          <CategorySection
            products={firstEditions}
            category='first-editions'
            title='First Editions'
            endpoint='first-editions'
          />
        )}
      </div>
    </>
  );
}
