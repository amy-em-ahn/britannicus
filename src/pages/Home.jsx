import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/firebase';
import ProductCard from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ProductImageCarousel from '../components/ui/ProductImageCarousel';
import HeroCarousel from '../components/ui/HeroCarousel';

const CategorySection = ({
  products,
  category,
  title,
  endpoint,
  onStatusChange
}) => {
  if (!products || products.length === 0) {
    return <p className='text-center'>No products available</p>;
  }

  return (
    <section className='w-full mb-12'>
      <div className='flex justify-between items-center mb-4 px-4'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <Link
          to={`/products/${endpoint}`}
          className='text-blue-600 hover:underline'
        >
          View All
        </Link>
      </div>
      <ul className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4'>
        {products.slice(0, 6).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onStatusChange={onStatusChange}
          />
        ))}
      </ul>
    </section>
  );
};

export default function Home() {
  const [statusMessage, setStatusMessage] = useState(null);

  const handleStatusChange = (status) => {
    setStatusMessage(status);
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  const {
    isLoading: loadingRareBooks,
    error: errorRareBooks,
    data: rareBooks
  } = useQuery(['products-rare-books-preview'], () =>
    getProducts('rare-books')
  );
  console.log(rareBooks);

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
  let allProducts;
  if (rareBooks && maps && periodicals && firstEditions) {
    allProducts = rareBooks
      ?.concat(maps, periodicals, firstEditions)
      .sort((a, b) => a.createdAt - b.createdAt)
      .splice(0, 12);
  }

  // console.log("all products: ", allProducts)
  return (
    <>
      <Helmet>
        <title>Home | Britannicus BMS</title>
      </Helmet>
      {/* {rareBooks && maps && periodicals && firstEditions && 
      <div>
        <h1 className='text-center text-[2rem] border-b-4 border-b-slate-900 w-fit m-auto px-10 mb-5'>Recent Additions</h1>
        <HeroCarousel allProducts={allProducts}/>
      </div>
      } */}
      {/* <ProductImageCarousel images={}/> */}
      <div className='w-full max-w-[1200px] mx-auto'>
        {statusMessage && (
          <div
            className={`m-4 p-4 rounded-md ${
              statusMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : statusMessage.type === 'info'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {statusMessage.message}
          </div>
        )}

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
            onStatusChange={handleStatusChange}
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
            onStatusChange={handleStatusChange}
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
            onStatusChange={handleStatusChange}
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
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </>
  );
}
