import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategoryInfo } from '../../api/firebase';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductListItem from '../../components/ProductListItem';
import CategorySidebar from '../../components/CategorySidebar';
import GenreTag from '../../components/ui/GenreTag';
import Pagination from '../../components/Pagination';
import SortSelector from '../../components/SortSelector';

export default function Products() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [categoryInfo, setCategoryInfo] = useState({
    title: 'All Products',
    description: 'Browse our complete collection of items from all categories.'
  });

  let categoryId = '';
  if (currentPath.includes('rare-books')) categoryId = 'rare-books';
  else if (currentPath.includes('maps')) categoryId = 'maps';
  else if (currentPath.includes('periodicals')) categoryId = 'periodicals';
  else if (currentPath.includes('first-editions'))
    categoryId = 'first-editions';

  const { data: categories } = useQuery(['categories'], getCategoryInfo);

  useEffect(() => {
    if (categories) {
      if (categoryId && categories[categoryId]) {
        setCategoryInfo(categories[categoryId]);
      } else {
        setCategoryInfo({
          title: 'All Products',
          description:
            'Browse our complete collection of items from all categories.'
        });
      }
    }
  }, [categories, categoryId]);

  const {
    isLoading,
    error,
    data: products
  } = useQuery([`products-${categoryId || 'all'}`], () =>
    getProducts(categoryId)
  );

  const getUniqueGenres = () => {
    if (!products) return [];

    const genres = products
      .flatMap((product) => {
        if (
          product.genres &&
          Array.isArray(product.genres) &&
          product.genres.length > 0
        ) {
          return product.genres;
        } else if (product.genre) {
          return [product.genre];
        }
        return [];
      })
      .filter((genre) => genre && genre.trim() !== '');

    return [...new Set(genres)].sort();
  };

  const availableGenres = getUniqueGenres();

  return (
    <>
      <Helmet>
        <title>{categoryInfo.title || 'Products'} | Britannicus BMS</title>
      </Helmet>

      <div className='flex w-full max-w-[1200px] mx-auto mt-8 px-4'>
        {/* Left Sidebar */}
        <CategorySidebar currentCategory={categoryId} />

        {/* Main Content */}
        <div className='w-full flex-1 ml-8'>
          {/* Genre Buttons Section */}
          <div className='mb-6'>
            <div className='flex flex-wrap gap-2 mb-4'>
              {availableGenres.map((genre) => (
                <GenreTag key={genre} label={genre} />
              ))}
            </div>

            <h1 className='text-3xl font-bold mb-3'>{categoryInfo.title}</h1>
            <p className='text-gray-600 mb-6'>{categoryInfo.description}</p>

            {/* Product Count and Sorting */}
            <div className='flex justify-between items-center py-4 border-b border-gray-200'>
              <div className='flex items-center gap-4'>
                <span className='text-gray-600'>
                  {isLoading
                    ? 'Loading products...'
                    : `Total: ${products?.length || 0} items`}
                </span>
                {/* Pagination */}
                <Pagination />
              </div>

              <div>
                <SortSelector />
              </div>
            </div>

            {error && (
              <p className='text-center text-red-500 my-8'>
                Error: {error.message}
              </p>
            )}

            {isLoading && (
              <p className='text-center my-8'>Loading products...</p>
            )}

            {/* Product Listing */}
            <ul className='mt-6 divide-y divide-gray-200'>
              {products && products.length > 0
                ? products.map((product) => (
                    <ProductListItem key={product.id} product={product} />
                  ))
                : !isLoading && (
                    <p className='text-center py-8 text-gray-500'>
                      No products found in this category.
                    </p>
                  )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
